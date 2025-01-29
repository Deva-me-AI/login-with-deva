import { useContext } from "react";
import { DevaContext } from "./DevaContext";


export const useLogin = () => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useLogin must be used within a DevaProvider");
  }

  return { login: devaContext.login };
};
