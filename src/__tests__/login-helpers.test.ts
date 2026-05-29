import { describe, expect, it, vi } from "vitest";
import {
  buildAuthorizeUrl,
  resolvePersist,
  shouldForceRedirect,
} from "../lib/login-helpers";

describe("shouldForceRedirect", () => {
  it("is false when no options or no prompt", () => {
    expect(shouldForceRedirect(undefined)).toBe(false);
    expect(shouldForceRedirect({})).toBe(false);
    expect(shouldForceRedirect({ state: "x" })).toBe(false);
  });

  it("is true when a prompt is provided", () => {
    expect(shouldForceRedirect({ prompt: "login" })).toBe(true);
  });
});

describe("buildAuthorizeUrl", () => {
  const base = {
    authorizationEndpoint: "https://www.deva.me/sso/authorize",
    clientId: "client-1",
    redirectUri: "https://app.example/callback",
    codeChallenge: "challenge-abc",
  };

  it("always includes the PKCE code-flow params", () => {
    const u = new URL(buildAuthorizeUrl(base));
    expect(u.searchParams.get("client_id")).toBe("client-1");
    expect(u.searchParams.get("redirect_uri")).toBe(
      "https://app.example/callback",
    );
    expect(u.searchParams.get("response_type")).toBe("code");
    expect(u.searchParams.get("code_challenge")).toBe("challenge-abc");
    expect(u.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("omits prompt and state when not provided", () => {
    const u = new URL(buildAuthorizeUrl(base));
    expect(u.searchParams.has("prompt")).toBe(false);
    expect(u.searchParams.has("state")).toBe(false);
  });

  it("appends prompt and state when provided", () => {
    const u = new URL(
      buildAuthorizeUrl({ ...base, prompt: "login", state: "s-123" }),
    );
    expect(u.searchParams.get("prompt")).toBe("login");
    expect(u.searchParams.get("state")).toBe("s-123");
  });
});

describe("resolvePersist", () => {
  const payload = { access_token: "a", state: null } as const;

  it("persists when there is no callback", () => {
    expect(resolvePersist(undefined, payload)).toBe(true);
  });

  it("persists when the callback returns falsy/undefined", () => {
    expect(resolvePersist(() => undefined, payload)).toBe(true);
    expect(resolvePersist(() => false, payload)).toBe(true);
  });

  it("does NOT persist when the callback returns true", () => {
    expect(resolvePersist(() => true, payload)).toBe(false);
  });

  it("passes the payload to the callback", () => {
    const cb = vi.fn(() => true);
    resolvePersist(cb, payload);
    expect(cb).toHaveBeenCalledWith(payload);
  });
});
