import { createContext } from "react";

export type DevaContext = {
  clientId: string;
  redirectUri: string;
  scopes: string[];

  authInProgress: boolean;
  authError: string | null;

  login: () => Promise<void>;
  logout: () => Promise<void>;

  idToken: string;
  accessToken: string;
  refreshToken: string;
};

export const DevaContext = createContext<DevaContext | null>(null);
