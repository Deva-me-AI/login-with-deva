import { useCallback, useState, useEffect, useRef } from "react";
import { DevaContext } from "./DevaContext";
import { Toaster } from "./components/ui/toaster";
import { generateCodeVerifier, generateCodeChallenge } from "./lib/crypto";
import { useStorage } from "./hooks/use-storage";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";

// TODO: move env
const baseUrl = "http://localhost:3000";

export type DevaProviderProps = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  children: React.ReactNode;
};

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
};

const useOpenIdConfig = () => {
  const { data, error, isLoading } = useSWR<OpenIdConfig>(
    `${baseUrl}/.well-known/openid-configuration`,
    fetcher,
  );
  return { openIdConfig: data, isOpenIdConfigLoading: isLoading, error };
};

export function DevaProvider({
  clientId,
  redirectUri,
  scopes,
  children,
}: DevaProviderProps) {
  const { openIdConfig, isOpenIdConfigLoading } = useOpenIdConfig();
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
    if (isOpenIdConfigLoading) {
      return;
    }

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store values in session storage
    setCodeVerifier(codeVerifier);

    // Redirect to the login page
    const u = new URL(openIdConfig?.authorization_endpoint ?? "");

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
    isOpenIdConfigLoading,
    openIdConfig,
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
