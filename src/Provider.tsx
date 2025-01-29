import { useCallback, useState, useEffect, useRef } from "react";
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
  const fetchingTokensRef = useRef(false);
  const [, setCodeVerifier] = useStorage("code_verifier", "");
  const [authInProgress, setAuthInProgress] = useStorage(
    "auth_in_progress",
    false,
  );

  const [authError, setAuthError] = useState<string | null>(null);

  const clearState = useCallback(() => {
    setCodeVerifier("");
  }, [setCodeVerifier]);

  const logout = useCallback(async () => {
    clearState();
    setAuthInProgress(false);
    // TODO: clear tokens
  }, [clearState, setAuthInProgress]);

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

  useEffect(() => {
    // TODO: refresh token timer
  }, []);

  useEffect(() => {
    if (authInProgress) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        const error_description =
          params.get("error_description") ?? "An unknown error occurred";

        console.error(
          `${error_description}\nExpected  to find a '?code=' parameter in the URL but found none`,
        );
        setAuthError(error_description);
        clearState();
        return;
      }
    }

    // we can only attempt to fetch tokens once
    if (fetchingTokensRef.current) {
      return;
    }

    fetchingTokensRef.current = true;

    // TODO: validate state

    // TODO: fetch tokens

    // clear search params
    window.history.replaceState({}, document.title, window.location.pathname);

    // run only once at page load
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DevaContext.Provider
      value={{
        clientId,
        redirectUri,
        scopes,

        login,
        logout,

        authInProgress,
        authError,
      }}
    >
      {children}
      <Toaster />
    </DevaContext.Provider>
  );
}
