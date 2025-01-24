import { createContext } from "react";

export type DevaContext = {
  appId: string;
  login: () => void;
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
