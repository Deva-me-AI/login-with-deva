import { useMemo, useCallback, useState } from "react";
import { DevaContext } from "./DevaContext";
import { Toaster } from "./components/ui/toaster";
import { generateCodeVerifier, generateCodeChallenge } from "./lib/crypto";
import useStorage from "./hooks/use-storage";

// TODO: need to get this from well known host
const baseUrl = "http://localhost:3000";
const loginUri = `${baseUrl}/sso/authorize`;

export type DevaProviderProps = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  children: React.ReactNode;
};

export function DevaProvider({
  clientId,
  redirectUri,
  scopes,
  children,
}: DevaProviderProps) {
  const [, setCodeVerifier] = useStorage("code_verifier", "");
  const [authInProgress, setAuthInProgress] = useStorage(
    "auth_in_progress",
    false,
  );

  const clearState = useCallback(() => {
    setCodeVerifier("");
  }, [setCodeVerifier]);

  const login = useCallback(async () => {
    clearState();
    setAuthInProgress(true);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store values in session storage
    setCodeVerifier(codeVerifier);

    // Redirect to the login page
    const u = new URL(loginUri);

    u.searchParams.append("client_id", clientId);
    u.searchParams.append("scopes", scopes.join(" "));
    u.searchParams.append("redirect_uri", redirectUri);

    u.searchParams.append("response_type", "code");
    u.searchParams.append("code_challenge", codeChallenge);
    u.searchParams.append("code_challenge_method", "S256");

    window.location.assign(u.toString());
  }, [
    clientId,
    redirectUri,
    scopes,
    setCodeVerifier,
    clearState,
    setAuthInProgress,
  ]);

  return (
    <DevaContext.Provider
      value={{
        clientId,
        redirectUri,
        scopes,
        login,
        authInProgress,
      }}
    >
      {children}
      <Toaster />
    </DevaContext.Provider>
  );
}
