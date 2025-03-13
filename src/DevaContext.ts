import { createContext, useContext } from "react";
import type { UserInfo } from "./server";
import type { Envs } from "./config";

export type DevaContext = {
  clientId: string;
  redirectUri: string;
  scopes: string[];

  env: Envs;

  authInProgress: boolean;
  authError: string | null;

  login: () => Promise<void>;
  logout: () => Promise<void>;

  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  user: UserInfo | null;

  isAuthenticated: boolean;
};

const defaultDevaContext: DevaContext = {
  clientId: "",
  redirectUri: "",
  scopes: [],

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
};

export const DevaContext = createContext<DevaContext | null>(null);

export const useDevaContext = () =>
  useContext(DevaContext) ?? defaultDevaContext;
