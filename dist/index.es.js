import { jsx as Re } from "react/jsx-runtime";
import { useState as X, useCallback as m, useEffect as T, useLayoutEffect as Pe, useRef as P, useContext as Te } from "react";
import { f as q, D as ge, u as we, r as Ae, b as Oe } from "./config-BS7uiZu2.js";
const J = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), pe(e);
}, pe = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), le = async (e) => {
  const t = new TextEncoder().encode(e), o = await crypto.subtle.digest("SHA-256", t);
  return pe(o);
}, Ie = (e) => Math.round(Date.now() / 1e3 + Number(e)), Z = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, B = typeof window < "u", Le = (e, r) => {
  if (!B)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function v(e, r) {
  const [t, o] = X(
    () => Le(e, r)
  ), l = m(
    (s) => {
      try {
        o(s), B && sessionStorage.setItem(e, JSON.stringify(s));
      } catch (c) {
        console.error(c);
      }
    },
    [e]
  );
  return T(() => {
    if (!B)
      return;
    const s = sessionStorage.getItem(e);
    if (s)
      try {
        o(JSON.parse(s));
      } catch (c) {
        console.error(c);
      }
  }, []), T(() => {
    if (!B)
      return;
    const s = (c) => {
      if (c.storageArea === window.sessionStorage && c.key === e)
        if (c.newValue === null)
          o(r);
        else
          try {
            o(JSON.parse(c.newValue));
          } catch {
            console.warn(
              `Failed to handle storageEvent's newValue='${c.newValue}' for key '${e}'`
            );
          }
    };
    return window.addEventListener("storage", s, !1), () => window.removeEventListener("storage", s, !1);
  }, [e, r]), [t, l];
}
class N extends Error {
}
N.prototype.name = "InvalidTokenError";
function xe(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (r, t) => {
    let o = t.charCodeAt(0).toString(16).toUpperCase();
    return o.length < 2 && (o = "0" + o), "%" + o;
  }));
}
function Ne(e) {
  let r = e.replace(/-/g, "+").replace(/_/g, "/");
  switch (r.length % 4) {
    case 0:
      break;
    case 2:
      r += "==";
      break;
    case 3:
      r += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return xe(r);
  } catch {
    return atob(r);
  }
}
function Ce(e, r) {
  if (typeof e != "string")
    throw new N("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, o = e.split(".")[t];
  if (typeof o != "string")
    throw new N(`Invalid token specified: missing part #${t + 1}`);
  let l;
  try {
    l = Ne(o);
  } catch (s) {
    throw new N(`Invalid token specified: invalid base64 for part #${t + 1} (${s.message})`);
  }
  try {
    return JSON.parse(l);
  } catch (s) {
    throw new N(`Invalid token specified: invalid json for part #${t + 1} (${s.message})`);
  }
}
const De = typeof window < "u" ? Pe : T;
function $e(e, r, t = [], o, l) {
  const s = P(e);
  De(() => {
    s.current = e;
  }, t), T(() => {
    if (!r && r !== 0)
      return;
    const c = o(() => {
      s.current();
    }, r);
    return () => {
      l(c);
    };
  }, [r]);
}
function Me(e, r, t = []) {
  $e(e, r, t, setInterval, clearInterval);
}
function Ve(e) {
  return (e == null ? void 0 : e.prompt) !== void 0;
}
function Ue(e) {
  return !!e.accessToken && Z(e.expiresIn);
}
function fe(e) {
  var t;
  if (!e.state)
    throw new Error("OAuth state is required");
  const r = new URL(e.authorizationEndpoint);
  return r.searchParams.append("client_id", e.clientId), r.searchParams.append("redirect_uri", e.redirectUri), r.searchParams.append("response_type", "code"), r.searchParams.append("code_challenge", e.codeChallenge), r.searchParams.append("code_challenge_method", "S256"), (t = e.scopes) != null && t.length && r.searchParams.append("scope", e.scopes.join(" ")), e.loginHint && r.searchParams.append("login_hint", e.loginHint), e.provider && r.searchParams.append("provider", e.provider), e.prompt && r.searchParams.append("prompt", e.prompt), r.searchParams.append("state", e.state), r.toString();
}
function ze(e) {
  return e.expectedState ? e.returnedState ? e.returnedState !== e.expectedState ? { ok: !1, error: "OAuth state mismatch" } : { ok: !0, callerState: e.callerState } : { ok: !1, error: "Missing OAuth state" } : { ok: !1, error: "Missing stored OAuth state" };
}
function he(e, r) {
  return (e == null ? void 0 : e(r)) !== !0;
}
const ee = "deva:silent-login-callback", Fe = [
  "login_required",
  "consent_required",
  "interaction_required"
], He = (e) => typeof e == "object" && e !== null, je = (e) => !He(e) || e.type !== ee || typeof e.state != "string" ? !1 : typeof e.code == "string" && e.code.length > 0 || typeof e.error == "string" && e.error.length > 0, Je = (e) => Fe.includes(e);
function qe(e) {
  if (e.parent === e)
    return !1;
  const r = new URLSearchParams(e.location.search), t = r.get("state") ?? "", o = r.get("code"), l = r.get("error");
  let s = null;
  return o ? s = {
    type: ee,
    code: o,
    state: t
  } : l && (s = {
    type: ee,
    error: l,
    error_description: r.get("error_description") ?? void 0,
    state: t
  }), s ? (e.parent.postMessage(s, e.location.origin), !0) : !1;
}
function Be(e) {
  return {
    state: `deva_silent_oauth_state:${e}`,
    codeVerifier: `deva_silent_code_verifier:${e}`
  };
}
function We(e) {
  return new Promise((r, t) => {
    const o = e.browserDocument.createElement("iframe");
    o.style.display = "none", o.setAttribute("aria-hidden", "true"), o.tabIndex = -1, o.title = "Deva silent sign-in";
    let l = !1;
    const s = () => {
      e.browserWindow.clearTimeout(D), e.browserWindow.removeEventListener("message", y), o.remove();
    }, c = () => l ? !1 : (l = !0, s(), !0), b = (i) => {
      c() && r(i);
    }, a = (i) => {
      c() && t(i);
    }, y = (i) => {
      if (!(i.origin !== e.callbackOrigin || i.source !== o.contentWindow || !je(i.data) || i.data.state !== e.expectedState)) {
        if ("code" in i.data) {
          b({ status: "success", code: i.data.code });
          return;
        }
        if (Je(i.data.error)) {
          b({ status: "no_session", error: i.data.error });
          return;
        }
        a(
          new Error(
            i.data.error_description ?? `Silent login failed: ${i.data.error}`
          )
        );
      }
    };
    e.browserWindow.addEventListener("message", y);
    const D = e.browserWindow.setTimeout(
      () => b({ status: "timeout" }),
      e.timeoutMs
    );
    o.src = e.authorizeUrl;
    try {
      e.browserDocument.body.appendChild(o);
    } catch (i) {
      a(
        i instanceof Error ? i : new Error("Unable to create the silent login iframe")
      );
    }
  });
}
const W = typeof window < "u" && typeof document < "u", C = (...e) => {
  console.log("[sdk/provider]", ...e);
}, Ke = (e) => {
  const { data: r, error: t, isLoading: o } = we(
    W ? `${e}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: r, isOpenIdConfigLoading: o, error: t };
}, Ye = (e, r) => {
  const { data: t, error: o, isLoading: l } = we(
    // Tuple key carries the token: when the background refresh rotates the
    // token, the key changes and SWR refetches userinfo with the new token
    // instead of staying stuck on the revoked one (agent-key-web#56).
    Oe(e, r),
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    },
    { keepPreviousData: !0 }
  );
  return {
    userInfo: t,
    isUserInfoLoading: l,
    userInfoError: o
  };
}, Ge = (e, r, t) => m(async () => {
  if (!r || !t) {
    C("no refresh token or token endpoint");
    return;
  }
  return q(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: e,
      refresh_token: r
    })
  });
}, [r, e, t]), Qe = (e, r, t) => m(async () => {
  !t || !e || await fetch(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      access_token: e,
      client_id: r
    })
  });
}, [e, r, t]);
function tr({
  clientId: e,
  redirectUri: r,
  children: t,
  env: o,
  baseUrl: l,
  onLoginComplete: s
}) {
  const c = Ae(o, l), b = P(s);
  b.current = s;
  const { openIdConfig: a, isOpenIdConfigLoading: y, error: D } = Ke(c);
  D && console.error("[sdk/provider] error fetching openid info: ", D);
  const i = P(!1), re = P(!1), te = P(!1);
  T(() => {
    o === "development" && !te.current && (te.current = !0, console.warn(
      `
========================================
⚠️  WARNING: DEVELOPMENT ENVIRONMENT  ⚠️
========================================
You are currently using the DEVELOPMENT environment.
This environment is for INTERNAL USE ONLY.

If you are seeing this warning, you may have the wrong environment configured.
Please verify your environment settings and use 'staging' or 'production' instead.
========================================
`
    ));
  }, [o]);
  const [me, $] = v("code_verifier", ""), [ye, M] = v(
    "oauth_state",
    null
  ), [Se, V] = v(
    "oauth_caller_state",
    null
  ), [K, O] = v(
    "auth_in_progress",
    !1
  ), [_e, U] = v("id_token", null), [h, z] = v(
    "access_token",
    null
  ), [E, F] = v(
    "refresh_token",
    null
  ), [R, H] = v("expires_in", 0), [ne, p] = X(!0), k = m(
    (n) => {
      let u = R;
      z(n.access_token), U(n.id_token);
      try {
        const f = Ce(n.id_token);
        u = Math.round(Number(f.exp) - Date.now() / 1e3);
      } catch (f) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${f.message}`
        );
      }
      const d = n.expires_in ?? u;
      H(Ie(d)), F(n.refresh_token);
    },
    [z, U, H, F, R]
  ), [ke, I] = X(null), { userInfo: ve } = Ye(
    a == null ? void 0 : a.userinfo_endpoint,
    h
  ), L = m(() => {
    $(""), O(!1), M(null), V(null);
  }, [$, O, M, V]), A = m(() => {
    L(), z(""), U(""), H(0), F("");
  }, [
    L,
    z,
    U,
    H,
    F
  ]), oe = Qe(
    h,
    e,
    a == null ? void 0 : a.revocation_endpoint
  ), se = m(async () => {
    await oe(), A(), I(null);
  }, [A, oe]), x = Ge(
    e,
    E,
    a == null ? void 0 : a.token_endpoint
  ), ae = m(
    async (n) => {
      const u = Ve(n);
      if (!u && h && !Z(R))
        return;
      if (!u && E) {
        if (y)
          return;
        p(!0);
        try {
          const w = await x();
          if (w) {
            k(w), S.current = 0;
            return;
          }
        } catch (w) {
          console.error(
            "[sdk/provider]: Error refreshing token during login",
            w
          );
        } finally {
          p(!1);
        }
        try {
          await new Promise((G) => setTimeout(G, 2e3)), p(!0);
          const w = await x();
          if (w) {
            k(w), S.current = 0;
            return;
          }
        } catch (w) {
          console.error("[sdk/provider]: Retry refresh also failed", w);
        } finally {
          p(!1);
        }
      }
      if (u || A(), O(!0), y)
        return;
      const d = J(), f = J(), g = await le(d);
      $(d), M(f), V((n == null ? void 0 : n.state) ?? null);
      const _ = fe({
        authorizationEndpoint: (a == null ? void 0 : a.authorization_endpoint) ?? "",
        clientId: e,
        redirectUri: r,
        codeChallenge: g,
        scopes: n == null ? void 0 : n.scopes,
        loginHint: n == null ? void 0 : n.loginHint,
        provider: n == null ? void 0 : n.provider,
        prompt: n == null ? void 0 : n.prompt,
        state: f
      });
      window.location.assign(_);
    },
    [
      h,
      R,
      E,
      x,
      k,
      p,
      e,
      r,
      $,
      M,
      V,
      A,
      O,
      y,
      a
    ]
  ), ie = m(
    async (n) => {
      if (typeof window > "u" || typeof document > "u" || !document.body)
        return { status: "unsupported" };
      const u = a ?? await q(
        `${c}/.well-known/openid-configuration`
      );
      if (!u.authorization_endpoint || !u.token_endpoint)
        return { status: "unsupported" };
      const d = J(), f = J(), g = await le(d), _ = Be(f);
      try {
        window.sessionStorage.setItem(_.state, f), window.sessionStorage.setItem(_.codeVerifier, d);
      } catch {
        try {
          window.sessionStorage.removeItem(_.state), window.sessionStorage.removeItem(_.codeVerifier);
        } catch {
        }
      }
      try {
        const w = fe({
          authorizationEndpoint: u.authorization_endpoint,
          clientId: e,
          redirectUri: r,
          codeChallenge: g,
          scopes: n == null ? void 0 : n.scopes,
          loginHint: n == null ? void 0 : n.loginHint,
          provider: n == null ? void 0 : n.provider,
          prompt: "none",
          state: f
        }), G = new URL(r, window.location.href).origin, ue = (n == null ? void 0 : n.timeoutMs) ?? 5e3, Ee = Number.isFinite(ue) ? Math.max(0, ue) : 5e3, Q = await We({
          authorizeUrl: w,
          callbackOrigin: G,
          expectedState: f,
          timeoutMs: Ee,
          browserWindow: window,
          browserDocument: document
        });
        if (Q.status !== "success")
          return Q;
        const de = await q(
          u.token_endpoint,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              client_id: e,
              redirect_uri: r,
              code: Q.code,
              code_verifier: d,
              grant_type: "authorization_code"
            })
          }
        );
        return he(b.current, {
          ...de,
          state: null
        }) && k(de), I(null), { status: "success" };
      } finally {
        try {
          window.sessionStorage.removeItem(_.state), window.sessionStorage.removeItem(_.codeVerifier);
        } catch {
        }
      }
    },
    [e, a, k, r, c]
  ), S = P(0), ce = P(0), Y = m(
    async (n = !1) => {
      if (!h) {
        C("no access token");
        return;
      }
      if (!Z(R) && !n) {
        S.current = 0;
        return;
      }
      if (ne && !n) {
        C("already refreshing");
        return;
      }
      if (!E) {
        C("no refresh token");
        return;
      }
      const u = S.current;
      if (u > 0 && !n) {
        const d = Math.min(
          1e3 * Math.pow(2, u),
          3e5
        );
        if (Date.now() - ce.current < d)
          return;
      }
      ce.current = Date.now(), p(!0);
      try {
        const d = await x();
        d ? (k(d), S.current = 0) : (S.current++, C(
          `refresh returned empty response (attempt ${S.current})`
        ));
      } catch (d) {
        S.current++, console.error(
          `[sdk/provider]: Error refreshing token (attempt ${S.current})`,
          d
        );
      } finally {
        p(!1);
      }
    },
    [
      h,
      E,
      x,
      k,
      ne,
      R,
      p
    ]
  ), be = 1e4 * Math.random();
  Me(
    () => {
      Y();
    },
    W && E ? 1e4 + be : null,
    [Y]
  ), T(() => {
    !W || window.parent === window || (re.current = qe(window));
  }, []), T(() => {
    let n = "";
    if (W && !re.current && !y) {
      if (K) {
        p(!1);
        const u = new URLSearchParams(window.location.search);
        n = u.get("code") ?? "";
        const d = u.get("state");
        if (!n) {
          const g = u.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${g}
Expected  to find a '?code=' parameter in the URL but found none`
          ), I(g), h ? L() : A();
          return;
        }
        const f = ze({
          returnedState: d,
          expectedState: ye,
          callerState: Se
        });
        if (!f.ok) {
          console.error(`[sdk/provider]: ${f.error}`), I("Invalid OAuth state"), h ? L() : A(), window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return;
        }
        if (O(!1), i.current)
          return;
        i.current = !0, q((a == null ? void 0 : a.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: n,
            code_verifier: me,
            grant_type: "authorization_code"
          })
        }).then((g) => {
          he(b.current, {
            ...g,
            state: f.callerState
          }) ? k(g) : i.current = !1, L();
        }).catch((g) => {
          console.error("[sdk/provider]: error in fetching", g), I("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      Ue({ accessToken: h, expiresIn: R }) ? Y(!0) : p(!1);
    }
  }, [y]);
  const j = {
    // A present access token means authenticated. Do NOT couple this to
    // `isRefreshing`: the proactive background refresh sets isRefreshing=true
    // for the token round-trip (~once per access-token lifetime, ~15min), and
    // gating isAuthenticated on it transiently de-authenticated the whole app
    // mid-refresh — consumers (e.g. neweco.ai) flipped their auth-gated UI to
    // the logged-out view and back, the "page refreshes every ~15min" bug.
    // The user becomes unauthenticated only when the token is cleared
    // (terminal refresh failure / logout), which nulls accessToken. See #19.
    isAuthenticated: !!h,
    accessToken: h,
    user: ve ?? null,
    login: ae,
    trySilentLogin: ie,
    logout: se,
    isReady: !y && !K
  };
  return /* @__PURE__ */ Re(
    ge.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: o,
        login: ae,
        trySilentLogin: ie,
        logout: se,
        authInProgress: K,
        authError: ke,
        idToken: _e,
        accessToken: h,
        refreshToken: E,
        user: j.user,
        isAuthenticated: j.isAuthenticated,
        isReady: j.isReady,
        url: c
      },
      children: typeof t == "function" ? t(j) : t
    }
  );
}
const nr = () => {
  const e = Te(ge);
  if (!e)
    throw new Error("useDeva must be used within a DevaProvider");
  return {
    isAuthenticated: !!e.accessToken,
    isReady: e.isReady,
    accessToken: e.accessToken,
    user: e.user,
    login: e.login,
    trySilentLogin: e.trySilentLogin,
    logout: e.logout
  };
};
export {
  tr as DevaProvider,
  nr as useDeva
};
