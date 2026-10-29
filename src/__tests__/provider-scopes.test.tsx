// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DevaProvider } from "../Provider";
import type { UseDevaReturn } from "../use-deva";
const { build, probe } = vi.hoisted(() => ({
  build: vi.fn(() => "https://example.com/authorize"),
  probe: vi.fn(async () => ({ status: "timeout" })),
}));
vi.mock("../lib/login-helpers", async (original) => ({
  ...(await original<object>()),
  buildAuthorizeUrl: build,
}));
vi.mock("../lib/silent-login", async (original) => ({
  ...(await original<object>()),
  runSilentLoginProbe: probe,
}));
vi.mock("../lib/crypto", async (original) => ({
  ...(await original<object>()),
  generateCodeChallenge: vi.fn(async () => "challenge"),
}));
vi.mock("../lib/fetcher", () => ({
  buildAuthedKey: vi.fn(),
  fetcher: vi.fn(),
  useSWRFetcher: () => ({
    data: {
      authorization_endpoint: "https://example.com/authorize",
      token_endpoint: "https://example.com/token",
    },
    isLoading: false,
  }),
}));
afterEach(() => {
  cleanup();
  sessionStorage.clear();

  vi.clearAllMocks();
});
it.each([false, true])(
  "passes provider scopes to authorize (silent=%s), allowing per-call overrides",
  async (silent) => {
    let sdk!: UseDevaReturn;
    render(
      <DevaProvider
        clientId="app"
        redirectUri="http://localhost/callback"
        env="production"
        scopes={["OPENID", "AI_COMPLETIONS"]}
      >
        {(value) => {
          sdk = value;
          return null;
        }}
      </DevaProvider>,
    );
    await act(async () => {
      await (silent ? sdk.trySilentLogin() : sdk.login());
    });
    expect(build).toHaveBeenLastCalledWith(
      expect.objectContaining({ scopes: ["OPENID", "AI_COMPLETIONS"] }),
    );
    await act(async () => {
      await (silent
        ? sdk.trySilentLogin({ scopes: ["OPENID"] })
        : sdk.login({ scopes: ["OPENID"] }));
    });
    expect(build).toHaveBeenLastCalledWith(
      expect.objectContaining({ scopes: ["OPENID"] }),
    );
  },
);
