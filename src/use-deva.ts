import { useContext } from "react";
import {
  DevaContext,
  type LoginOptions,
  type TrySilentLoginOptions,
  type TrySilentLoginResult,
} from "./DevaContext";
import type { UserInfo } from "./server";

export type UseDevaReturn = {
  isAuthenticated: boolean;
  isReady: boolean;
  accessToken: string | null;
  user: UserInfo | null;
  login: (options?: LoginOptions) => Promise<void>;
  trySilentLogin: (
    options?: TrySilentLoginOptions,
  ) => Promise<TrySilentLoginResult>;
  logout: () => Promise<void>;
};

export const useDeva = (): UseDevaReturn => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useDeva must be used within a DevaProvider");
  }

  return {
    isAuthenticated: !!devaContext.accessToken,
    isReady: devaContext.isReady,
    accessToken: devaContext.accessToken,

    user: devaContext.user,
    login: devaContext.login,
    trySilentLogin: devaContext.trySilentLogin,
    logout: devaContext.logout,
  };
};
