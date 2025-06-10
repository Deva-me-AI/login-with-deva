import { useContext } from "react";
import { DevaContext } from "./DevaContext";

export const useDeva = () => {
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
