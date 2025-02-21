import { useContext } from "react";
import { DevaContext } from "./DevaContext";

export const useDeva = () => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useDeva must be used within a DevaProvider");
  }

  return {
    accessToken: devaContext.accessToken,
    user: devaContext.user,
    logout: devaContext.logout,
    
    env: devaContext.env,

    isAuthenticated: devaContext.accessToken !== null,
  };
};
