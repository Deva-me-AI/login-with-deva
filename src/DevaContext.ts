import { createContext } from "react";

export type DevaContext = {
  clientId: string;
  redirectUri: string;
  scopes: string[];

  authInProgress: boolean;
  authError: string | null;

  login: () => Promise<void>;
  logout: () => Promise<void>;

  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export const DevaContext = createContext<DevaContext | null>(null);
