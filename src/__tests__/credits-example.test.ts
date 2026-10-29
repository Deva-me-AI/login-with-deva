import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const { session, exchange, chat, save } = vi.hoisted(() => ({
  session: vi.fn(),
  exchange: vi.fn(),
  chat: vi.fn(),
  save: vi.fn(),
}));
vi.mock("../../examples/nextjs-credits/lib/session", () => ({
  readSession: session,
  saveSession: save,
  appOrigin: () => "https://example.com",
  config: () => ({
    clientId: "app",
    clientSecret: "secret",
    redirectUri: "https://example.com/api/deva/callback",
  }),
}));
vi.mock("@deva-me/login-with-deva/server", async () => {
  const actual = await import("../ai-server");
  return {
    ...actual,
    exchangeCode: exchange,
    createDevaAI: vi.fn(() => ({ chat })),
  };
});
import { GET as login } from "../../examples/nextjs-credits/app/api/deva/login/route";
import { GET as callback } from "../../examples/nextjs-credits/app/api/deva/callback/route";
import { POST } from "../../examples/nextjs-credits/app/api/deva/chat/route";
import { DevaAIError } from "../ai-server";
beforeEach(() => {
  session.mockResolvedValue({ accessToken: "server-only" });
});
afterEach(() => vi.resetAllMocks());
const request = (
  body: unknown = { messages: [{ role: "user", content: "hi" }] },
  origin = "https://example.com",
) =>
  new Request("https://example.com/api/deva/chat", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
describe("credits example", () => {
  it("starts server-owned PKCE with credits scope", async () => {
    const response = await login();
    const url = new URL(response.headers.get("location")!);
    expect(url.searchParams.get("scope")).toBe("OPENID AI_COMPLETIONS");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        state: url.searchParams.get("state"),
        verifier: expect.any(String) as unknown,
      }),
    );
    expect(url.searchParams.has("client_secret")).toBe(false);
  });
  it.each([undefined, {}, { state: "different", verifier: "v" }])(
    "rejects an invalid callback session",
    async (value) => {
      session.mockResolvedValue(value);
      expect(
        (
          await callback(
            new Request("https://example.com/api/deva/callback?state=s&code=c"),
          )
        ).status,
      ).toBe(400);
      expect(exchange).not.toHaveBeenCalled();
    },
  );
  it("consumes state, exchanges server-side, and stores only a server token", async () => {
    const value = { state: "s", verifier: "v" };
    session.mockResolvedValue(value);
    exchange.mockResolvedValue({ access_token: "server-only", expires_in: 30 });
    const response = await callback(
      new Request("https://example.com/api/deva/callback?state=s&code=c"),
    );
    expect(response.status).toBe(303);
    expect(value).toEqual({});
    expect(exchange).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "c",
        codeVerifier: "v",
        clientSecret: "secret",
      }),
    );
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: "server-only",
        expiresAt: expect.any(Number) as unknown,
      }),
    );
    expect(await response.text()).not.toContain("server-only");
    expect(
      (
        await callback(
          new Request("https://example.com/api/deva/callback?state=s&code=c"),
        )
      ).status,
    ).toBe(400);
  });
  it("does not expose exchange errors", async () => {
    session.mockResolvedValue({ state: "s", verifier: "v" });
    exchange.mockRejectedValue(new Error("private"));
    const response = await callback(
      new Request("https://example.com/api/deva/callback?state=s&code=c"),
    );
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain("private");
  });
  it("rejects cross-origin and unauthenticated spend", async () => {
    expect((await POST(request({}, "https://other.com"))).status).toBe(403);
    session.mockResolvedValue(undefined);
    expect((await POST(request())).status).toBe(401);
    expect(chat).not.toHaveBeenCalled();
  });
  it.each([
    null,
    {},
    { messages: [] },
    { messages: [{ role: "system", content: "hi" }] },
    { messages: [{ role: "user", content: "" }] },
    { messages: [{ role: "user", content: "x".repeat(8001) }] },
    { model: 123, messages: [{ role: "user", content: "hi" }] },
  ])("validates chat input", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(chat).not.toHaveBeenCalled();
  });
  it("uses the default model, caps output, and returns the actual model", async () => {
    chat.mockResolvedValue({ model: "actual" });
    const response = await POST(
      request({
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 999999,
      }),
    );
    expect(chat).toHaveBeenCalledWith({
      model: "user-default",
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 512,
    });
    expect(await response.json()).toEqual({ model: "actual" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([new DevaAIError("app_budget_exceeded", 402), new Error("private")])(
    "returns safe errors",
    async (error) => {
      chat.mockRejectedValue(error);
      const response = await POST(request());
      expect(response.status).toBe(error instanceof DevaAIError ? 402 : 502);
      expect(await response.text()).not.toContain("private");
    },
  );
});
