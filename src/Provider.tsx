import { useCallback, useState, useEffect, useRef } from "react";
import { DevaContext } from "./DevaContext";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  epochAtSecondsFromNow,
  epochTimeIsPast,
} from "./lib/crypto";
import { useStorage } from "./hooks/use-storage";
import { fetcher, useSWRFetcher } from "./lib/fetcher";
import type { OidcAccessTokenJWT, UserInfo } from "./server";
import { jwtDecode } from "jwt-decode";
import { useInterval } from "./hooks/use-timeout";
import { type Envs, envToUrl } from "./config";
import type { useDeva } from "./use-deva";

// Check if we're running in a browser environment
const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// Logger function that prefixes logs with [sdk/provider]
const log = (...args: Parameters<typeof console.log>) => {
  console.log("[sdk/provider]", ...args);
};

export type DevaProviderProps = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  children:
    | React.ReactNode
    | ((devaProps: ReturnType<typeof useDeva>) => React.ReactNode);
  env: Envs;
};

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  revocation_endpoint: string;
};

const useOpenIdConfig = (env: Envs) => {
  const baseUrl = envToUrl(env);
  const { data, error, isLoading } = useSWRFetcher<OpenIdConfig, Error>(
    isBrowser ? `${baseUrl}/.well-known/openid-configuration` : null,
  );
  return { openIdConfig: data, isOpenIdConfigLoading: isLoading, error };
};

const useUserInfo = (
  userInfoUrl: string | undefined,
  authToken: string | null,
) => {
  const { data, error, isLoading } = useSWRFetcher<UserInfo, Error>(
    authToken ? userInfoUrl : false,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  return {
    userInfo: data,
    isUserInfoLoading: isLoading,
    userInfoError: error,
  };
};

const useRefreshToken = (
  clientId: string,
  refreshToken: string | null,
  tokenEndpoint?: string,
) => {
  const refresh = useCallback(async () => {
    if (!refreshToken || !tokenEndpoint) {
      log("no refresh token or token endpoint");
      return;
    }

    return fetcher<OidcAccessTokenJWT>(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    });
  }, [refreshToken, clientId, tokenEndpoint]);

  return refresh;
};

const useRevokeToken = (
  accessToken: string | null,
  clientId: string,
  revokeUri?: string,
) => {
  const revoke = useCallback(async () => {
    if (!revokeUri || !accessToken) {
      return;
    }
    await fetch(revokeUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        client_id: clientId,
      }),
    });
  }, [accessToken, clientId, revokeUri]);

  return revoke;
};

export function DevaProvider({
  clientId,
  redirectUri,
  scopes,
  children,
  env,
}: DevaProviderProps) {
  const url = envToUrl(env);
  const { openIdConfig, isOpenIdConfigLoading, error } = useOpenIdConfig(env);
  if (error) {
    console.error("[sdk/provider]", openIdConfig);
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

  const [isRefreshing, setIsRefreshing] = useState(true);

  const handleTokenResponse = useCallback(
    (res: OidcAccessTokenJWT) => {
      let tokenExp = expiresIn;
      setAccessToken(res.access_token);
      setIdToken(res.id_token);
      // Decode IdToken, so we can use "exp" from that as fallback if expire not returned in the response
      try {
        const decodedToken = jwtDecode(res.id_token);
        tokenExp = Math.round(Number(decodedToken.exp) - Date.now() / 1000); // number of seconds from now
      } catch (e) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${(e as Error).message}`,
        );
      }

      const tokenExpiresIn = res.expires_in ?? tokenExp;

      setExpiresIn(epochAtSecondsFromNow(tokenExpiresIn));
      setRefreshToken(res.refresh_token);
      setCodeVerifier("");
    },
    [
      setAccessToken,
      setIdToken,
      setExpiresIn,
      setRefreshToken,
      setCodeVerifier,
      expiresIn,
    ],
  );

  const [authError, setAuthError] = useState<string | null>(null);

  const { userInfo } = useUserInfo(
    openIdConfig?.userinfo_endpoint,
    isRefreshing ? null : accessToken,
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

  const revokeToken = useRevokeToken(
    accessToken,
    clientId,
    openIdConfig?.revocation_endpoint,
  );
  const logout = useCallback(async () => {
    await revokeToken();
    clearState();
    setAuthError(null);
  }, [clearState, revokeToken]);

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

  const callRefreshApi = useRefreshToken(
    clientId,
    refreshToken,
    openIdConfig?.token_endpoint,
  );

  const refresh = useCallback(
    async (init = false) => {
      if (!accessToken) {
        log("no access token");
        return;
      }

      if (!epochTimeIsPast(expiresIn) && !init) {
        // log("access token not expired yet");
        return;
      }

      if (isRefreshing && !init) {
        log("already refreshing");
        return;
      }

      if (!refreshToken) {
        // TODO: handle this better
        log("no refresh token");
        return;
      }

      setIsRefreshing(true);
      try {
        const res = await callRefreshApi();

        if (res) {
          handleTokenResponse(res);
        }
      } catch (error) {
        console.error("[sdk/provider]: Error refreshing token", error);
      } finally {
        setIsRefreshing(false);
      }
    },
    [
      accessToken,
      refreshToken,
      callRefreshApi,
      handleTokenResponse,
      isRefreshing,
      expiresIn,
      setIsRefreshing,
    ],
  );

  const stagger = 10000 * Math.random();
  useInterval(
    () => {
      void refresh();
    },
    isBrowser && refreshToken ? 1000 + stagger : null,
    [refresh],
  );

  useEffect(() => {
    let code = "";

    if (!isBrowser) {
      return;
    }

    // check if openIdConfig is loaded
    if (isOpenIdConfigLoading) {
      return;
    }

    if (authInProgress) {
      setIsRefreshing(false);
      const params = new URLSearchParams(window.location.search);
      code = params.get("code") ?? "";

      if (!code) {
        const error_description =
          params.get("error_description") ?? "An unknown error occurred";

        console.error(
          `[sdk/provider]: ${error_description}\nExpected  to find a '?code=' parameter in the URL but found none`,
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

      fetcher<OidcAccessTokenJWT>(openIdConfig?.token_endpoint ?? "", {
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
          console.error("[sdk/provider]: error in fetching", error);
          setAuthError("An error occurred while fetching tokens");
        });

      // clear search params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    void refresh(true);
  }, [isOpenIdConfigLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const devaProps = {
    isAuthenticated: !!accessToken && !isRefreshing,
    accessToken: accessToken,
    user: userInfo ?? null,
    login,
    logout,
  };
  return (
    <DevaContext.Provider
      value={{
        clientId,
        redirectUri,
        scopes,

        env,

        login,
        logout,

        authInProgress,
        authError,

        idToken,
        accessToken,
        refreshToken,

        user: devaProps.user,
        isAuthenticated: devaProps.isAuthenticated,

        url,
      }}
    >
      {typeof children === "function" ? children(devaProps) : children}
    </DevaContext.Provider>
  );
}
