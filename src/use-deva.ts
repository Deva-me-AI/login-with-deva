import { useContext } from "react";
import { DevaContext } from "./DevaContext";
import type { UserInfo } from "./server";

export type UseDevaReturn = {
  isAuthenticated: boolean;
  isReady: boolean;
  accessToken: string | null;
  user: UserInfo | null;
  login: () => Promise<void>;
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
    logout: devaContext.logout,
  };
};
