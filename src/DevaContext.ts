import { createContext } from "react";

export type DevaContext = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
};

// const devaContextDefaults = {
//   isLoginOpen: false,
// };

// export const getDefaults = (
//   initial: { appId: string } & Partial<DevaContext>,
// ): DevaContext => ({
//   ...devaContextDefaults,
//   ...initial,
// });

export const DevaContext = createContext<DevaContext | null>(null);
