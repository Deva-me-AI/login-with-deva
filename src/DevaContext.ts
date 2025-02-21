import { createContext } from "react";
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
};

export const DevaContext = createContext<DevaContext | null>(null);
