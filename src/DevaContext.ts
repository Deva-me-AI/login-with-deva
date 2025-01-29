import { createContext } from "react";

export type DevaContext = {
  clientId: string;
  id?: string;
  redirectUri: string;
  scopes: string[];
  authInProgress: boolean;
  token?: string;
  error?: string;

  login: () => Promise<void>;
};

export const DevaContext = createContext<DevaContext | null>(null);
