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

const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

const base64URLEncode = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(digest);
};

export type UseLoginArgs = {
  onSuccess: () => void;
};

export const useLogin = ({ onSuccess }: UseLoginArgs) => {
  const devaContext = useContext(DevaContext);

  if (!devaContext) {
    throw new Error("useLogin must be used within a DevaProvider");
  }

  const loginUri = `${api}/sso/authorize`;

  const login = useCallback(async () => {
    const scopes = devaContext.scopes;
    const clientId = devaContext.clientId;
    const nonce = generateNonce();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store values in session storage
    sessionStorage.setItem("auth_nonce", nonce);
    sessionStorage.setItem("code_verifier", codeVerifier);

    // Redirect to the login page
    const u = new URL(loginUri);

    u.searchParams.append("client_id", clientId);
    u.searchParams.append("scopes", scopes.join(" "));
    u.searchParams.append("nonce", nonce);
    u.searchParams.append("redirect_uri", devaContext.redirectUri);
    u.searchParams.append("response_type", "code");
    u.searchParams.append("code_challenge", codeChallenge);
    u.searchParams.append("code_challenge_method", "S256");

    window.location.href = u.toString();
  }, [
    devaContext.clientId,
    devaContext.redirectUri,
    devaContext.scopes,
    loginUri,
  ]);

  return { login };
};
