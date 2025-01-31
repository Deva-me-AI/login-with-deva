import { useContext } from "react";
import { DevaContext } from "./DevaContext";

export const useDeva = () => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useDeva must be used within a DevaProvider");
  }

  return {
    user: devaContext.user,
    LogOut: devaContext.logout,
  };
};
