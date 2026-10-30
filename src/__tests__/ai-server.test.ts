import { AI_COMPLETIONS, SCOPE_INFO } from "../scopes";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createDevaAI,
  DevaAIError,
  exchangeCode,
} from "../ai-server";

afterEach(() => vi.unstubAllGlobals());
const reply = (body: unknown, status = 200) => {
  const fetch = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetch);
  return fetch;
};
describe("server AI client", () => {
  it("defaults the model and preserves the actual response model", async () => {
    const response = { model: "actual-model", choices: [] };
    const fetch = reply(response);
    expect(
      await createDevaAI({ accessToken: "secret" }).chat({ messages: [] }),
    ).toEqual(response);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.deva.me/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer secret",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "user-default", messages: [] }),
      }),
    );
  });
  it("supports a custom base URL, explicit model and token limit", async () => {
    const fetch = reply({});
    await createDevaAI({
      accessToken: "secret",
      baseUrl: "https://example.com/",
    }).chat({
      model: "chosen",
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 12,
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/v1/chat/completions",
      expect.objectContaining({
        body: JSON.stringify({
          model: "chosen",
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 12,
        }),
      }),
    );
  });
  it.each([
    [401, "unauthenticated"],
    [403, "missing_scope"],
    [402, "app_budget_exceeded"],
    [402, "insufficient_credits"],
    [429, "rate_limited"],
  ] as const)("maps %s to %s", async (status, code) => {
    reply({ detail: { reason: code } }, status);
    await expect(
      createDevaAI({ accessToken: "secret" }).chat({ messages: [] }),
    ).rejects.toMatchObject({ name: "DevaAIError", status, code });
  });
  it.each([500, 402])(
    "does not misclassify an unknown %s error",
    async (status) => {
      reply({}, status);
      await expect(
        createDevaAI({ accessToken: "secret" }).models(),
      ).rejects.not.toBeInstanceOf(DevaAIError);
    },
  );
  it.each(["models", "allowance"] as const)("reads %s", async (method) => {
    const data = { remaining_usd: 3 };
    const fetch = reply(data);
    expect(await createDevaAI({ accessToken: "secret" })[method]()).toEqual(
      data,
    );
    expect(fetch).toHaveBeenCalledWith(
      `https://api.deva.me/v1/${method === "models" ? "models" : "credits/app-allowance"}`,
      expect.objectContaining({ method: "GET" }),
    );
  });
  it("exchanges the code with confidential client credentials and PKCE", async () => {
    const fetch = reply({ access_token: "server-only" });
    expect(
      await exchangeCode({
        clientId: "app",
        clientSecret: "secret",
        code: "code",
        codeVerifier: "verifier",
        redirectUri: "https://example.com/callback",
      }),
    ).toEqual({ access_token: "server-only" });
    expect(fetch).toHaveBeenCalledWith(
      "https://www.deva.me/api/sso/token",
      expect.objectContaining({
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "app",
          client_secret: "secret",
          code: "code",
          code_verifier: "verifier",
          redirect_uri: "https://example.com/callback",
        }),
      }),
    );
  });
});

it("supports a custom token endpoint and maps exchange failures", async () => {
  const fetch = reply({}, 401);
  await expect(
    exchangeCode({
      clientId: "app",
      clientSecret: "secret",
      code: "c",
      codeVerifier: "v",
      redirectUri: "https://example.com/callback",
      tokenEndpoint: "https://example.com/token",
    }),
  ).rejects.toMatchObject({ code: "unauthenticated" });
  expect(fetch.mock.calls[0]?.[0]).toBe("https://example.com/token");
});
it("maps non-JSON authentication failures and preserves network errors", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response("not JSON", { status: 403 }))
    .mockRejectedValueOnce(new Error("offline"));
  vi.stubGlobal("fetch", fetch);
  const ai = createDevaAI({ accessToken: "secret" });
  await expect(ai.allowance()).rejects.toMatchObject({ code: "missing_scope" });
  await expect(ai.chat({ messages: [] })).rejects.toThrow("offline");
});

it("exports the AI scope and consent description", () => {
  expect(AI_COMPLETIONS).toBe("AI_COMPLETIONS");
  expect(SCOPE_INFO[AI_COMPLETIONS]).toBe(
    "Use your Deva credits for AI, up to the monthly limit you approve.",
  );
});
