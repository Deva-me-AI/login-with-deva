import { useContext, useCallback } from "react";
import { DevaContext } from "./DevaContext";

const api = "http://localhost:3000";

const generateNonce = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

export const useLogin = () => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useLogin must be used within a DevaProvider");
  }

  const loginUri = `${api}/sso/authorize`;

  const login = useCallback(() => {
    const scopes = devaContext.scopes;
    const clientId = devaContext.clientId;
    const nonce = generateNonce();
    sessionStorage.setItem("auth_nonce", nonce);

    // Redirect to the login page
    const u = new URL(loginUri);

    u.searchParams.append("client_id", clientId);
    u.searchParams.append("scopes", scopes.join(" "));
    u.searchParams.append("nonce", nonce);
    u.searchParams.append("redirect_uri", devaContext.redirectUri);

    window.location.href = u.toString();
  }, [
    devaContext.clientId,
    devaContext.redirectUri,
    devaContext.scopes,
    loginUri,
  ]);

  return { login };
};
