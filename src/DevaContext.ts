import { createContext, useContext } from "react";
import type { UserInfo } from "./server";
import type { Envs } from "./config";

export type LoginOptions = {
  /**
   * OpenID Connect `prompt` parameter. Forwarded to the authorization
   * endpoint and bypasses the in-memory "already authenticated" guard
   * so a new OAuth flow runs even when a valid token is present.
   *
   * Use `"login"` to force the identity provider to show the sign-in
   * screen (e.g. for an "Add account" / multi-account flow).
   */
  prompt?: "login" | "consent" | "none" | "select_account";
};

export type DevaContext = {
  clientId: string;
  redirectUri: string;

  env: Envs;

  authInProgress: boolean;
  authError: string | null;

  login: (options?: LoginOptions) => Promise<void>;
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
