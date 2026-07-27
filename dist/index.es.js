import { jsx as Ee } from "react/jsx-runtime";
import { useState as X, useCallback as y, useEffect as P, useLayoutEffect as Re, useRef as R, useContext as Pe } from "react";
import { f as B, D as he, u as ge, r as Te, b as Ae } from "./config-BS7uiZu2.js";
const q = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), we(e);
}, we = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), de = async (e) => {
  const t = new TextEncoder().encode(e), o = await crypto.subtle.digest("SHA-256", t);
  return we(o);
}, Oe = (e) => Math.round(Date.now() / 1e3 + Number(e)), Z = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, W = typeof window < "u", Le = (e, r) => {
  if (!W)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function _(e, r) {
  const [t, o] = X(
    () => Le(e, r)
  ), d = y(
    (s) => {
      try {
        o(s), W && sessionStorage.setItem(e, JSON.stringify(s));
      } catch (c) {
        console.error(c);
      }
    },
    [e]
  );
  return P(() => {
    if (!W)
      return;
    const s = sessionStorage.getItem(e);
    if (s)
      try {
        o(JSON.parse(s));
      } catch (c) {
        console.error(c);
      }
  }, []), P(() => {
    if (!W)
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
  }, [e, r]), [t, d];
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
function Ie(e, r) {
  if (typeof e != "string")
    throw new N("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, o = e.split(".")[t];
  if (typeof o != "string")
    throw new N(`Invalid token specified: missing part #${t + 1}`);
  let d;
  try {
    d = Ne(o);
  } catch (s) {
    throw new N(`Invalid token specified: invalid base64 for part #${t + 1} (${s.message})`);
  }
  try {
    return JSON.parse(d);
  } catch (s) {
    throw new N(`Invalid token specified: invalid json for part #${t + 1} (${s.message})`);
  }
}
const Ce = typeof window < "u" ? Re : P;
function De(e, r, t = [], o, d) {
  const s = R(e);
  Ce(() => {
    s.current = e;
  }, t), P(() => {
    if (!r && r !== 0)
      return;
    const c = o(() => {
      s.current();
    }, r);
    return () => {
      d(c);
    };
  }, [r]);
}
function Me(e, r, t = []) {
  De(e, r, t, setInterval, clearInterval);
}
function $e(e) {
  return (e == null ? void 0 : e.prompt) !== void 0;
}
function Ue(e) {
  return !!e.accessToken && Z(e.expiresIn);
}
function le(e) {
  var t;
  if (!e.state)
    throw new Error("OAuth state is required");
  const r = new URL(e.authorizationEndpoint);
  return r.searchParams.append("client_id", e.clientId), r.searchParams.append("redirect_uri", e.redirectUri), r.searchParams.append("response_type", "code"), r.searchParams.append("code_challenge", e.codeChallenge), r.searchParams.append("code_challenge_method", "S256"), (t = e.scopes) != null && t.length && r.searchParams.append("scope", e.scopes.join(" ")), e.loginHint && r.searchParams.append("login_hint", e.loginHint), e.provider && r.searchParams.append("provider", e.provider), e.prompt && r.searchParams.append("prompt", e.prompt), r.searchParams.append("state", e.state), r.toString();
}
function Ve(e) {
  return e.expectedState ? e.returnedState ? e.returnedState !== e.expectedState ? { ok: !1, error: "OAuth state mismatch" } : { ok: !0, callerState: e.callerState } : { ok: !1, error: "Missing OAuth state" } : { ok: !1, error: "Missing stored OAuth state" };
}
function fe(e, r) {
  return (e == null ? void 0 : e(r)) !== !0;
}
const ee = "deva:silent-login-callback", ze = [
  "login_required",
  "consent_required",
  "interaction_required"
], Fe = (e) => typeof e == "object" && e !== null, He = (e) => !Fe(e) || e.type !== ee || typeof e.state != "string" ? !1 : typeof e.code == "string" && e.code.length > 0 || typeof e.error == "string" && e.error.length > 0, je = (e) => ze.includes(e);
function Je(e) {
  if (e.parent === e)
    return !1;
  const r = new URLSearchParams(e.location.search), t = r.get("state") ?? "", o = r.get("code"), d = r.get("error");
  let s = null;
  return o ? s = {
    type: ee,
    code: o,
    state: t
  } : d && (s = {
    type: ee,
    error: d,
    error_description: r.get("error_description") ?? void 0,
    state: t
  }), s ? (e.parent.postMessage(s, e.location.origin), !0) : !1;
}
function qe(e) {
  return new Promise((r, t) => {
    const o = e.browserDocument.createElement("iframe");
    o.style.display = "none", o.setAttribute("aria-hidden", "true"), o.tabIndex = -1, o.title = "Deva silent sign-in";
    let d = !1;
    const s = () => {
      e.browserWindow.clearTimeout(C), e.browserWindow.removeEventListener("message", m), o.remove();
    }, c = () => d ? !1 : (d = !0, s(), !0), v = (i) => {
      c() && r(i);
    }, a = (i) => {
      c() && t(i);
    }, m = (i) => {
      if (!(i.origin !== e.callbackOrigin || i.source !== o.contentWindow || !He(i.data) || i.data.state !== e.expectedState)) {
        if ("code" in i.data) {
          v({ status: "success", code: i.data.code });
          return;
        }
        if (je(i.data.error)) {
          v({ status: "no_session", error: i.data.error });
          return;
        }
        a(
          new Error(
            i.data.error_description ?? `Silent login failed: ${i.data.error}`
          )
        );
      }
    };
    e.browserWindow.addEventListener("message", m);
    const C = e.browserWindow.setTimeout(
      () => v({ status: "timeout" }),
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
const Y = typeof window < "u" && typeof document < "u", I = (...e) => {
  console.log("[sdk/provider]", ...e);
}, Be = (e) => {
  const { data: r, error: t, isLoading: o } = ge(
    Y ? `${e}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: r, isOpenIdConfigLoading: o, error: t };
}, We = (e, r) => {
  const { data: t, error: o, isLoading: d } = ge(
    // Tuple key carries the token: when the background refresh rotates the
    // token, the key changes and SWR refetches userinfo with the new token
    // instead of staying stuck on the revoked one (agent-key-web#56).
    Ae(e, r),
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    },
    { keepPreviousData: !0 }
  );
  return {
    userInfo: t,
    isUserInfoLoading: d,
    userInfoError: o
  };
}, Ye = (e, r, t) => y(async () => {
  if (!r || !t) {
    I("no refresh token or token endpoint");
    return;
  }
  return B(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: e,
      refresh_token: r
    })
  });
}, [r, e, t]), Ge = (e, r, t) => y(async () => {
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
function er({
  clientId: e,
  redirectUri: r,
  children: t,
  env: o,
  baseUrl: d,
  onLoginComplete: s
}) {
  const c = Te(o, d), v = R(s);
  v.current = s;
  const { openIdConfig: a, isOpenIdConfigLoading: m, error: C } = Be(c);
  C && console.error("[sdk/provider] error fetching openid info: ", C);
  const i = R(!1), re = R(!1), te = R(!1);
  P(() => {
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
  const [pe, D] = _("code_verifier", ""), [ye, M] = _(
    "oauth_state",
    null
  ), [me, $] = _(
    "oauth_caller_state",
    null
  ), [G, A] = _(
    "auth_in_progress",
    !1
  ), [Se, U] = _("id_token", null), [h, V] = _(
    "access_token",
    null
  ), [b, z] = _(
    "refresh_token",
    null
  ), [E, F] = _("expires_in", 0), [ne, p] = X(!0), k = y(
    (n) => {
      let u = E;
      V(n.access_token), U(n.id_token);
      try {
        const f = Ie(n.id_token);
        u = Math.round(Number(f.exp) - Date.now() / 1e3);
      } catch (f) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${f.message}`
        );
      }
      const l = n.expires_in ?? u;
      F(Oe(l)), z(n.refresh_token);
    },
    [V, U, F, z, E]
  ), [ke, O] = X(null), { userInfo: _e } = We(
    a == null ? void 0 : a.userinfo_endpoint,
    h
  ), L = y(() => {
    D(""), A(!1), M(null), $(null);
  }, [D, A, M, $]), T = y(() => {
    L(), V(""), U(""), F(0), z("");
  }, [
    L,
    V,
    U,
    F,
    z
  ]), oe = Ge(
    h,
    e,
    a == null ? void 0 : a.revocation_endpoint
  ), se = y(async () => {
    await oe(), T(), O(null);
  }, [T, oe]), x = Ye(
    e,
    b,
    a == null ? void 0 : a.token_endpoint
  ), ae = y(
    async (n) => {
      const u = $e(n);
      if (!u && h && !Z(E))
        return;
      if (!u && b) {
        if (m)
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
          await new Promise((J) => setTimeout(J, 2e3)), p(!0);
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
      if (u || T(), A(!0), m)
        return;
      const l = q(), f = q(), g = await de(l);
      D(l), M(f), $((n == null ? void 0 : n.state) ?? null);
      const j = le({
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
      window.location.assign(j);
    },
    [
      h,
      E,
      b,
      x,
      k,
      p,
      e,
      r,
      D,
      M,
      $,
      T,
      A,
      m,
      a
    ]
  ), ie = y(
    async (n) => {
      if (typeof window > "u" || typeof document > "u" || !document.body)
        return { status: "unsupported" };
      const u = a ?? await B(
        `${c}/.well-known/openid-configuration`
      );
      if (!u.authorization_endpoint || !u.token_endpoint)
        return { status: "unsupported" };
      const l = q(), f = q(), g = await de(l), j = le({
        authorizationEndpoint: u.authorization_endpoint,
        clientId: e,
        redirectUri: r,
        codeChallenge: g,
        scopes: n == null ? void 0 : n.scopes,
        loginHint: n == null ? void 0 : n.loginHint,
        provider: n == null ? void 0 : n.provider,
        prompt: "none",
        state: f
      }), w = new URL(r, window.location.href).origin, J = (n == null ? void 0 : n.timeoutMs) ?? 5e3, be = Number.isFinite(J) ? Math.max(0, J) : 5e3, Q = await qe({
        authorizeUrl: j,
        callbackOrigin: w,
        expectedState: f,
        timeoutMs: be,
        browserWindow: window,
        browserDocument: document
      });
      if (Q.status !== "success")
        return Q;
      const ue = await B(u.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: e,
          redirect_uri: r,
          code: Q.code,
          code_verifier: l,
          grant_type: "authorization_code"
        })
      });
      return fe(v.current, {
        ...ue,
        state: null
      }) && k(ue), O(null), { status: "success" };
    },
    [e, a, k, r, c]
  ), S = R(0), ce = R(0), K = y(
    async (n = !1) => {
      if (!h) {
        I("no access token");
        return;
      }
      if (!Z(E) && !n) {
        S.current = 0;
        return;
      }
      if (ne && !n) {
        I("already refreshing");
        return;
      }
      if (!b) {
        I("no refresh token");
        return;
      }
      const u = S.current;
      if (u > 0 && !n) {
        const l = Math.min(
          1e3 * Math.pow(2, u),
          3e5
        );
        if (Date.now() - ce.current < l)
          return;
      }
      ce.current = Date.now(), p(!0);
      try {
        const l = await x();
        l ? (k(l), S.current = 0) : (S.current++, I(
          `refresh returned empty response (attempt ${S.current})`
        ));
      } catch (l) {
        S.current++, console.error(
          `[sdk/provider]: Error refreshing token (attempt ${S.current})`,
          l
        );
      } finally {
        p(!1);
      }
    },
    [
      h,
      b,
      x,
      k,
      ne,
      E,
      p
    ]
  ), ve = 1e4 * Math.random();
  Me(
    () => {
      K();
    },
    Y && b ? 1e4 + ve : null,
    [K]
  ), P(() => {
    !Y || window.parent === window || (re.current = Je(window));
  }, []), P(() => {
    let n = "";
    if (Y && !re.current && !m) {
      if (G) {
        p(!1);
        const u = new URLSearchParams(window.location.search);
        n = u.get("code") ?? "";
        const l = u.get("state");
        if (!n) {
          const g = u.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${g}
Expected  to find a '?code=' parameter in the URL but found none`
          ), O(g), h ? L() : T();
          return;
        }
        const f = Ve({
          returnedState: l,
          expectedState: ye,
          callerState: me
        });
        if (!f.ok) {
          console.error(`[sdk/provider]: ${f.error}`), O("Invalid OAuth state"), h ? L() : T(), window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return;
        }
        if (A(!1), i.current)
          return;
        i.current = !0, B((a == null ? void 0 : a.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: n,
            code_verifier: pe,
            grant_type: "authorization_code"
          })
        }).then((g) => {
          fe(v.current, {
            ...g,
            state: f.callerState
          }) ? k(g) : i.current = !1, L();
        }).catch((g) => {
          console.error("[sdk/provider]: error in fetching", g), O("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      Ue({ accessToken: h, expiresIn: E }) ? K(!0) : p(!1);
    }
  }, [m]);
  const H = {
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
    user: _e ?? null,
    login: ae,
    trySilentLogin: ie,
    logout: se,
    isReady: !m && !G
  };
  return /* @__PURE__ */ Ee(
    he.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: o,
        login: ae,
        trySilentLogin: ie,
        logout: se,
        authInProgress: G,
        authError: ke,
        idToken: Se,
        accessToken: h,
        refreshToken: b,
        user: H.user,
        isAuthenticated: H.isAuthenticated,
        isReady: H.isReady,
        url: c
      },
      children: typeof t == "function" ? t(H) : t
    }
  );
}
const rr = () => {
  const e = Pe(he);
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
  er as DevaProvider,
  rr as useDeva
};
