import { useCallback, useState, useEffect, useRef } from "react";
import {
  DevaContext,
  type LoginOptions,
  type LoginCompletePayload,
} from "./DevaContext";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  epochAtSecondsFromNow,
  epochTimeIsPast,
} from "./lib/crypto";
import { useStorage } from "./hooks/use-storage";
import { buildAuthedKey, fetcher, useSWRFetcher } from "./lib/fetcher";
import type { OidcAccessTokenJWT, UserInfo } from "./server";
import { jwtDecode } from "jwt-decode";
import { useInterval } from "./hooks/use-timeout";
import { type Envs, resolveDevaUrl } from "./config";
import {
  buildAuthorizeUrl,
  resolvePersist,
  shouldForceRedirect,
  shouldForceRefreshOnBootstrap,
  verifyOAuthState,
} from "./lib/login-helpers";
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
  children: React.ReactNode | ((devaProps: UseDevaReturn) => React.ReactNode);
  env: Envs;
  /**
   * Optional explicit base URL for the Deva IdP, overriding `env`. Point this
   * at a local endeva on any host/port (e.g. "http://localhost:3001") for
   * local development/testing. When omitted, the URL is derived from `env`.
   */
  baseUrl?: string;
  /**
   * Called on the redirect return leg with the freshly-exchanged tokens and
   * the round-tripped `state`. Return `true` to tell the SDK NOT to persist
   * the tokens itself (the consumer is routing them, e.g. multi-account).
   */
  onLoginComplete?: (payload: LoginCompletePayload) => boolean | void;
};

type OpenIdConfig = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  revocation_endpoint: string;
};

const useOpenIdConfig = (baseUrl: string) => {
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
    // Tuple key carries the token: when the background refresh rotates the
    // token, the key changes and SWR refetches userinfo with the new token
    // instead of staying stuck on the revoked one (agent-key-web#56).
    buildAuthedKey(userInfoUrl, authToken),
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    { keepPreviousData: true },
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
  baseUrl,
  onLoginComplete,
}: DevaProviderProps) {
  const url = resolveDevaUrl(env, baseUrl);
  // Held in a ref so it can be read from the return-leg effect without
  // becoming a dependency (the effect intentionally runs once on config load).
  const onLoginCompleteRef = useRef(onLoginComplete);
  onLoginCompleteRef.current = onLoginComplete;
  const { openIdConfig, isOpenIdConfigLoading, error } = useOpenIdConfig(url);
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
          "========================================\n",
      );
    }
  }, [env]);
  const [codeVerifier, setCodeVerifier] = useStorage("code_verifier", "");
  const [oauthState, setOauthState] = useStorage<string | null>(
    "oauth_state",
    null,
  );
  const [oauthCallerState, setOauthCallerState] = useStorage<string | null>(
    "oauth_caller_state",
    null,
  );
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
      setOauthState(null);
      setOauthCallerState(null);
    },
    [
      setAccessToken,
      setIdToken,
      setExpiresIn,
      setRefreshToken,
      setCodeVerifier,
      setOauthState,
      setOauthCallerState,
      expiresIn,
    ],
  );

  const [authError, setAuthError] = useState<string | null>(null);

  const { userInfo } = useUserInfo(
    openIdConfig?.userinfo_endpoint,
    accessToken,
  );

  const clearTransientAuthState = useCallback(() => {
    setCodeVerifier("");
    setAuthInProgress(false);
    setOauthState(null);
    setOauthCallerState(null);
  }, [setCodeVerifier, setAuthInProgress, setOauthState, setOauthCallerState]);

  const clearState = useCallback(() => {
    clearTransientAuthState();
    setAccessToken("");
    setIdToken("");
    setExpiresIn(0);
    setRefreshToken("");
  }, [
    clearTransientAuthState,
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

  const login = useCallback(
    async (options?: LoginOptions) => {
      // When a `prompt` is supplied the caller wants a fresh OAuth round-trip
      // (e.g. "Add account"). Skip the already-authenticated guard and the
      // silent-refresh path — both would otherwise short-circuit the redirect.
      const forceRedirect = shouldForceRedirect(options);

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
          console.error(
            "[sdk/provider]: Error refreshing token during login",
            error,
          );
        } finally {
          setIsRefreshing(false);
        }

        // Refresh failed — retry once more after a short delay before giving up
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000));
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

      // On a forced redirect, keep the current session intact: if the user
      // cancels at deva.me they return with their original account unchanged,
      // and we avoid writing empty token values a consumer storage mirror
      // would propagate into the active account's namespace.
      if (!forceRedirect) {
        clearState();
      }
      setAuthInProgress(true);
      if (isOpenIdConfigLoading) {
        return;
      }

      const codeVerifier = generateCodeVerifier();
      const state = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store values in session storage
      setCodeVerifier(codeVerifier);
      setOauthState(state);
      setOauthCallerState(options?.state ?? null);

      // Redirect to the login page
      const authorizeUrl = buildAuthorizeUrl({
        authorizationEndpoint: openIdConfig?.authorization_endpoint ?? "",
        clientId,
        redirectUri,
        codeChallenge,
        prompt: options?.prompt,
        state,
      });

      window.location.assign(authorizeUrl);
    },
    [
      accessToken,
      expiresIn,
      refreshToken,
      callRefreshApi,
      handleTokenResponse,
      setIsRefreshing,
      clientId,
      redirectUri,
      setCodeVerifier,
      setOauthState,
      setOauthCallerState,
      clearState,
      setAuthInProgress,
      isOpenIdConfigLoading,
      openIdConfig,
    ],
  );

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
        const backoffMs = Math.min(
          1000 * Math.pow(2, failCount),
          5 * 60 * 1000,
        ); // max 5 min
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
          log(
            `refresh returned empty response (attempt ${refreshFailCountRef.current})`,
          );
        }
      } catch (error) {
        refreshFailCountRef.current++;
        console.error(
          `[sdk/provider]: Error refreshing token (attempt ${refreshFailCountRef.current})`,
          error,
        );
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
      const returnedState = params.get("state");

      if (!code) {
        const error_description =
          params.get("error_description") ?? "An unknown error occurred";

        console.error(
          `[sdk/provider]: ${error_description}\nExpected  to find a '?code=' parameter in the URL but found none`,
        );
        setAuthError(error_description);
        if (!accessToken) {
          // Normal fresh login error: nothing to preserve, clear everything
          // (this also resets authInProgress and the PKCE verifier).
          clearState();
        } else {
          // Forced redirect cancelled (e.g. user backed out of "Add account"):
          // preserve the existing session, but still reset the transient flow
          // state so the SDK doesn't get stuck with authInProgress = true.
          clearTransientAuthState();
        }
        return;
      }

      const stateVerification = verifyOAuthState({
        returnedState,
        expectedState: oauthState,
        callerState: oauthCallerState,
      });

      if (!stateVerification.ok) {
        console.error(`[sdk/provider]: ${stateVerification.error}`);
        setAuthError("Invalid OAuth state");
        if (!accessToken) {
          clearState();
        } else {
          clearTransientAuthState();
        }
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
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
        .then((res) => {
          const persist = resolvePersist(onLoginCompleteRef.current, {
            ...res,
            state: stateVerification.callerState,
          });
          if (persist) {
            handleTokenResponse(res);
          } else {
            // Consumer handled storage (e.g. multi-account routing). Reset the
            // double-exchange guard so a later login() in the same session
            // (without a page reload) can exchange a new code, and clear the
            // spent PKCE verifier (handleTokenResponse would normally do this).
            fetchingTokensRef.current = false;
            clearTransientAuthState();
          }
        })
        .catch((error) => {
          console.error("[sdk/provider]: error in fetching", error);
          setAuthError("An error occurred while fetching tokens");
        });

      // clear search params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (shouldForceRefreshOnBootstrap({ accessToken, expiresIn })) {
      void refresh(true);
    } else {
      // No token, or the restored token is still valid — don't rotate it.
      // Rotating a valid token revokes it and races the userinfo request, so
      // `user` goes null and consumer circuit breakers loop (agent-key-web#56).
      // The proactive interval renews the token before it expires instead.
      setIsRefreshing(false);
    }
  }, [isOpenIdConfigLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const devaProps = {
    // A present access token means authenticated. Do NOT couple this to
    // `isRefreshing`: the proactive background refresh sets isRefreshing=true
    // for the token round-trip (~once per access-token lifetime, ~15min), and
    // gating isAuthenticated on it transiently de-authenticated the whole app
    // mid-refresh — consumers (e.g. neweco.ai) flipped their auth-gated UI to
    // the logged-out view and back, the "page refreshes every ~15min" bug.
    // The user becomes unauthenticated only when the token is cleared
    // (terminal refresh failure / logout), which nulls accessToken. See #19.
    isAuthenticated: !!accessToken,
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
