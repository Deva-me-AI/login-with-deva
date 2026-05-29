import type { LoginCompletePayload, LoginOptions } from "../DevaContext";

/**
 * A `prompt` means the caller wants a fresh OAuth round-trip (e.g. "Add
 * account") even when a valid session exists, so the login guards must be
 * bypassed. `state` alone does not force a redirect.
 */
export function shouldForceRedirect(options?: LoginOptions): boolean {
  return options?.prompt !== undefined;
}

/** Build the OIDC authorization-code + PKCE authorize URL. */
export function buildAuthorizeUrl(params: {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  prompt?: LoginOptions["prompt"];
  state?: string;
}): string {
  const u = new URL(params.authorizationEndpoint);
  // No `scope` param: matches the SDK's existing authorize URL; the IdP applies
  // the client's configured default scopes.
  u.searchParams.append("client_id", params.clientId);
  u.searchParams.append("redirect_uri", params.redirectUri);
  u.searchParams.append("response_type", "code");
  u.searchParams.append("code_challenge", params.codeChallenge);
  u.searchParams.append("code_challenge_method", "S256");
  if (params.prompt) u.searchParams.append("prompt", params.prompt);
  if (params.state) u.searchParams.append("state", params.state);
  return u.toString();
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
