import type { LoginCompletePayload, LoginOptions } from "../DevaContext";
import { epochTimeIsPast } from "./crypto";

/**
 * A `prompt` means the caller wants a fresh OAuth round-trip (e.g. "Add
 * account") even when a valid session exists, so the login guards must be
 * bypassed. `state` alone does not force a redirect.
 */
export function shouldForceRedirect(options?: LoginOptions): boolean {
  return options?.prompt !== undefined;
}

/**
 * On provider bootstrap, only force a token refresh when we hold a token that
 * has actually expired. Force-refreshing a still-valid token rotates and
 * revokes it server-side (refresh tokens are single-use), which races the
 * in-flight userinfo request and leaves `user` null -> consumer circuit
 * breakers loop the login flow (agent-key-web#56). A still-valid token is
 * renewed by the proactive background interval instead.
 */
export function shouldForceRefreshOnBootstrap(params: {
  accessToken: string | null;
  expiresIn: number;
}): boolean {
  return !!params.accessToken && epochTimeIsPast(params.expiresIn);
}

/** Build the OIDC authorization-code + PKCE authorize URL. */
export function buildAuthorizeUrl(params: {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scopes?: LoginOptions["scopes"];
  loginHint?: LoginOptions["loginHint"];
  provider?: LoginOptions["provider"];
  prompt?: LoginOptions["prompt"];
  state: string;
}): string {
  if (!params.state) {
    throw new Error("OAuth state is required");
  }

  const u = new URL(params.authorizationEndpoint);
  u.searchParams.append("client_id", params.clientId);
  u.searchParams.append("redirect_uri", params.redirectUri);
  u.searchParams.append("response_type", "code");
  u.searchParams.append("code_challenge", params.codeChallenge);
  u.searchParams.append("code_challenge_method", "S256");
  if (params.scopes?.length) {
    u.searchParams.append("scope", params.scopes.join(" "));
  }
  if (params.loginHint) {
    u.searchParams.append("login_hint", params.loginHint);
  }
  if (params.provider) {
    u.searchParams.append("provider", params.provider);
  }
  if (params.prompt) u.searchParams.append("prompt", params.prompt);
  u.searchParams.append("state", params.state);
  return u.toString();
}

export function verifyOAuthState(params: {
  returnedState: string | null;
  expectedState: string | null;
  callerState: string | null;
}): { ok: true; callerState: string | null } | { ok: false; error: string } {
  if (!params.expectedState) {
    return { ok: false, error: "Missing stored OAuth state" };
  }

  if (!params.returnedState) {
    return { ok: false, error: "Missing OAuth state" };
  }

  if (params.returnedState !== params.expectedState) {
    return { ok: false, error: "OAuth state mismatch" };
  }

  return { ok: true, callerState: params.callerState };
}

/**
 * Decide whether the SDK should persist the exchanged tokens itself. The
 * consumer's `onLoginComplete` returning `true` means "I handled storage,
 * SDK: do not persist" — used by multi-account consumers that route tokens
 * into their own per-account namespace. Any other return (or no callback)
 * keeps the default single-account persistence.
 */
export function resolvePersist(
  onLoginComplete:
    | ((payload: LoginCompletePayload) => boolean | void)
    | undefined,
  payload: LoginCompletePayload,
): boolean {
  const handled = onLoginComplete?.(payload);
  return handled !== true;
}
