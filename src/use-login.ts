import { useContext } from "react";
import { DevaContext } from "./DevaContext";

const api = "https://localhost:3000";

export const useLogin = () => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useLogin must be used within a DevaProvider");
  }

  const loginUri = `${api}/auth/login`;

  const redirectToLogin = () => {
    window.location.href = loginUri;
  };

  return { redirectToLogin };
};
