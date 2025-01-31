import { useCallback, useState, useEffect, useRef } from "react";
import { DevaContext } from "./DevaContext";
import { Toaster } from "./components/ui/toaster";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  epochAtSecondsFromNow,
} from "./lib/crypto";
import { useStorage } from "./hooks/use-storage";
import useSWR from "swr";
import { fetcher } from "./lib/fetcher";
import type { OidcAccessTokenJWT, UserInfo } from "./server";
import { jwtDecode } from "jwt-decode";

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
  const { data, error, isLoading } = useSWR<OpenIdConfig, Error>(
    `${baseUrl}/.well-known/openid-configuration`,
    fetcher,
  );
  return { openIdConfig: data, isOpenIdConfigLoading: isLoading, error };
};

const useUserInfo = (
  userInfoUrl: string | undefined,
  authToken: string | null,
) => {
  const { data, error, isLoading } = useSWR<UserInfo, Error>(
    authToken ?? userInfoUrl,
    () =>
      fetcher(userInfoUrl!, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }),
  );

  return {
    userInfo: data,
    isUserInfoLoading: isLoading,
    userInfoError: error,
  };
};

export function DevaProvider({
  clientId,
  redirectUri,
  scopes,
  children,
}: DevaProviderProps) {
  const { openIdConfig, isOpenIdConfigLoading, error } = useOpenIdConfig();
  if (error) {
    console.error(openIdConfig);
  }
  const fetchingTokensRef = useRef(false);
  const [codeVerifier, setCodeVerifier] = useStorage("code_verifier", "");
  const [authInProgress, setAuthInProgress] = useStorage(
    "auth_in_progress",
    false,
  );
  const [idToken, setIdToken] = useStorage<string | null>("id_token", null);
  const [accessToken, setAccessToken] = useStorage<string | null>(
    "access_token",
    null,
  );
  const [refreshToken, setRefreshToken] = useStorage<string | null>(
    "refresh_token",
    null,
  );
  const [expiresIn, setExpiresIn] = useStorage("expires_in", 0); // TODO: figure out sensible default

  let tokenExp = expiresIn;

  const handleTokenResponse = (res: OidcAccessTokenJWT) => {
    setAccessToken(res.id_token);
    setIdToken(res.id_token);
    // Decode IdToken, so we can use "exp" from that as fallback if expire not returned in the response
    try {
      const decodedToken = jwtDecode(res.id_token);
      tokenExp = Math.round(Number(decodedToken.exp) - Date.now() / 1000); // number of seconds from now
    } catch (e) {
      console.warn(`Failed to decode idToken: ${(e as Error).message}`);
    }

    const tokenExpiresIn = res.expires_in ?? tokenExp;

    setExpiresIn(epochAtSecondsFromNow(tokenExpiresIn));
    setRefreshToken(res.refresh_token);
    setCodeVerifier("");
  };

  const [authError, setAuthError] = useState<string | null>(null);

  const { userInfo, isUserInfoLoading, userInfoError } = useUserInfo(
    openIdConfig?.userinfo_endpoint,
    accessToken,
  );

  const clearState = useCallback(() => {
    setCodeVerifier("");
    setAuthInProgress(false);
    setAccessToken("");
    setIdToken("");
    setExpiresIn(0);
    setRefreshToken("");
  }, [
    setCodeVerifier,
    setAuthInProgress,
    setAccessToken,
    setIdToken,
    setExpiresIn,
    setRefreshToken,
  ]);

  const logout = useCallback(async () => {
    clearState();
    setAuthError(null);

    // TODO: revoke access
  }, [clearState]);

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
    let code = "";

    // check if openIdConfig is loaded
    if (isOpenIdConfigLoading) {
      return;
    }

    if (!authInProgress) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    code = params.get("code") ?? "";

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

    setAuthInProgress(false);

    // we can only attempt to fetch tokens once
    if (fetchingTokensRef.current) {
      return;
    }

    fetchingTokensRef.current = true;

    fetcher(openIdConfig?.token_endpoint ?? "", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
      }),
    })
      .then(handleTokenResponse)
      .catch((error) => {
        console.error("error in fetching", error);
        setAuthError("An error occurred while fetching tokens");
      });

    // clear search params
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [isOpenIdConfigLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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

        idToken,
        accessToken,
        refreshToken,
      }}
    >
      {children}
      <Toaster />
    </DevaContext.Provider>
  );
}
