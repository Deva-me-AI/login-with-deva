import { useCallback, useState, useEffect, useRef } from "react";
import { DevaContext, type LoginOptions } from "./DevaContext";
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
import type { UseDevaReturn } from "./use-deva";

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
  children:
    | React.ReactNode
    | ((devaProps: UseDevaReturn) => React.ReactNode);
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
  children,
  env,
}: DevaProviderProps) {
  const url = envToUrl(env);
  const { openIdConfig, isOpenIdConfigLoading, error } = useOpenIdConfig(env);
  if (error) {
    console.error("[sdk/provider] error fetching openid info: ", error);
  }

  const fetchingTokensRef = useRef(false);
  const hasWarnedRef = useRef(false);

  // Warn when using development environment
  useEffect(() => {
    if (env === "development" && !hasWarnedRef.current) {
      hasWarnedRef.current = true;
      console.warn(
        "\n" +
          "========================================\n" +
          "⚠️  WARNING: DEVELOPMENT ENVIRONMENT  ⚠️\n" +
          "========================================\n" +
          "You are currently using the DEVELOPMENT environment.\n" +
          "This environment is for INTERNAL USE ONLY.\n" +
          "\n" +
          "If you are seeing this warning, you may have the wrong environment configured.\n" +
          "Please verify your environment settings and use 'staging' or 'production' instead.\n" +
          "========================================\n"
      );
    }
  }, [env]);
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

  const callRefreshApi = useRefreshToken(
    clientId,
    refreshToken,
    openIdConfig?.token_endpoint,
  );

  const login = useCallback(async (options?: LoginOptions) => {
    // When a `prompt` is supplied, the caller wants a fresh OAuth round-trip
    // (e.g. "Add account"). Skip the already-authenticated guard and the
    // silent-refresh path — both would otherwise short-circuit the redirect
    // and re-authenticate the existing session.
    const forceRedirect = options?.prompt !== undefined;

    if (!forceRedirect && accessToken && !epochTimeIsPast(expiresIn)) {
      return;
    }

    // Try silent refresh first before redirecting
    if (!forceRedirect && refreshToken) {
      if (isOpenIdConfigLoading) {
        return;
      }

      setIsRefreshing(true);
      try {
        const res = await callRefreshApi();
        if (res) {
          handleTokenResponse(res);
          refreshFailCountRef.current = 0;
          return;
        }
      } catch (error) {
        console.error("[sdk/provider]: Error refreshing token during login", error);
      } finally {
        setIsRefreshing(false);
      }

      // Refresh failed — retry once more after a short delay before giving up
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsRefreshing(true);
        const retryRes = await callRefreshApi();
        if (retryRes) {
          handleTokenResponse(retryRes);
          refreshFailCountRef.current = 0;
          return;
        }
      } catch (error) {
        console.error("[sdk/provider]: Retry refresh also failed", error);
      } finally {
        setIsRefreshing(false);
      }
    }

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
    u.searchParams.append("redirect_uri", redirectUri);

    u.searchParams.append("response_type", "code");
    u.searchParams.append("code_challenge", codeChallenge);
    u.searchParams.append("code_challenge_method", "S256");

    if (options?.prompt) {
      u.searchParams.append("prompt", options.prompt);
    }

    window.location.assign(u.toString());
  }, [
    accessToken,
    expiresIn,
    refreshToken,
    callRefreshApi,
    handleTokenResponse,
    setIsRefreshing,
    clientId,
    redirectUri,
    setCodeVerifier,
    clearState,
    setAuthInProgress,
    isOpenIdConfigLoading,
    openIdConfig,
  ]);

  // Track consecutive refresh failures for exponential backoff
  const refreshFailCountRef = useRef(0);
  const lastRefreshAttemptRef = useRef(0);

  const refresh = useCallback(
    async (init = false) => {
      if (!accessToken) {
        log("no access token");
        return;
      }

      if (!epochTimeIsPast(expiresIn) && !init) {
        // Token still valid — reset failure counter
        refreshFailCountRef.current = 0;
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

      // Exponential backoff: don't hammer the token endpoint on repeated failures
      const failCount = refreshFailCountRef.current;
      if (failCount > 0 && !init) {
        const backoffMs = Math.min(1000 * Math.pow(2, failCount), 5 * 60 * 1000); // max 5 min
        const elapsed = Date.now() - lastRefreshAttemptRef.current;
        if (elapsed < backoffMs) {
          return;
        }
      }

      lastRefreshAttemptRef.current = Date.now();
      setIsRefreshing(true);
      try {
        const res = await callRefreshApi();

        if (res) {
          handleTokenResponse(res);
          refreshFailCountRef.current = 0; // success — reset backoff
        } else {
          refreshFailCountRef.current++;
          log(`refresh returned empty response (attempt ${refreshFailCountRef.current})`);
        }
      } catch (error) {
        refreshFailCountRef.current++;
        console.error(`[sdk/provider]: Error refreshing token (attempt ${refreshFailCountRef.current})`, error);
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

  // Proactive refresh: try to renew the token 60 seconds before expiry,
  // not after. The interval polls every ~10-20s; the refresh() function
  // gates on epochTimeIsPast which has a 30s buffer, so combined we
  // attempt renewal well before actual expiry.
  const stagger = 10000 * Math.random();
  useInterval(
    () => {
      void refresh();
    },
    isBrowser && refreshToken ? 10000 + stagger : null,
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
    isReady: !isOpenIdConfigLoading && !authInProgress,
  };
  return (
    <DevaContext.Provider
      value={{
        clientId,
        redirectUri,

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
        isReady: devaProps.isReady,

        url,
      }}
    >
      {typeof children === "function" ? children(devaProps) : children}
    </DevaContext.Provider>
  );
}
