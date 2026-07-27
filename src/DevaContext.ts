import { createContext, useContext } from "react";
import type { UserInfo } from "./server";
import type { Envs } from "./config";

type AuthorizationHints = {
  /** OAuth scopes to request. */
  scopes?: string[];
  /** Hint the account identifier to the identity provider. */
  loginHint?: string;
  /** Skip the Deva provider chooser when the provider is already known. */
  provider?: string;
};

export type LoginOptions = AuthorizationHints & {
  /**
   * OpenID Connect `prompt`. Forwarded to the authorization endpoint and
   * bypasses the already-authenticated / silent-refresh guards so a fresh
   * OAuth round-trip runs even when a valid token is present. Use `"login"`
   * to force the sign-in screen (e.g. an "Add account" / multi-account flow).
   *
   * NOTE: any value here triggers a full-page redirect and bypasses the local
   * session guards — this is NOT a silent/iframe check, so `"none"` still
   * navigates away rather than probing silently. The Deva IdP currently only
   * acts on `"login"` (forcing re-authentication / account choice); other
   * values are forwarded as-is and may be ignored by the IdP.
   */
  prompt?: "login" | "consent" | "none" | "select_account";
  /**
   * Opaque caller data returned to `onLoginComplete`. The SDK protects the
   * OAuth callback with its own generated `state` nonce and stores this value
   * locally until that nonce is verified.
   */
  state?: string;
};

export type TrySilentLoginOptions = AuthorizationHints & {
  /** Maximum time to wait for the hidden-iframe callback. Defaults to 5000ms. */
  timeoutMs?: number;
};

export type SilentLoginNoSessionError =
  | "login_required"
  | "consent_required"
  | "interaction_required";

/** Result of a background Deva session probe. */
export type TrySilentLoginResult =
  | { status: "success" }
  | { status: "no_session"; error: SilentLoginNoSessionError }
  | { status: "timeout" }
  | { status: "unsupported" };

/** Shape handed to `onLoginComplete` on the redirect return leg. */
export type LoginCompletePayload = {
  access_token: string;
  // refresh_token / id_token / expires_in are optional to decouple from the
  // server token schema; the current Deva flow always populates them.
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  /** Whatever the consumer passed to `login({ state })`; null if none. */
  state: string | null;
};

export type DevaContext = {
  clientId: string;
  redirectUri: string;

  env: Envs;

  authInProgress: boolean;
  authError: string | null;

  login: (options?: LoginOptions) => Promise<void>;
  trySilentLogin: (
    options?: TrySilentLoginOptions,
  ) => Promise<TrySilentLoginResult>;
  logout: () => Promise<void>;

  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  user: UserInfo | null;

  isAuthenticated: boolean;
  isReady: boolean;

  url: string;
};

const defaultDevaContext: DevaContext = {
  clientId: "",
  redirectUri: "",

  env: "development",

  authInProgress: false,
  authError: null,

  login: () => Promise.resolve(),
  trySilentLogin: () => Promise.resolve({ status: "unsupported" }),
  logout: () => Promise.resolve(),

  idToken: null,
  accessToken: null,
  refreshToken: null,

  user: null,

  isAuthenticated: false,
  isReady: false,

  url: "",
};

export const DevaContext = createContext<DevaContext | null>(null);

export const useDevaContext = () =>
  useContext(DevaContext) ?? defaultDevaContext;
