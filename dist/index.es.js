import { jsx as Re } from "react/jsx-runtime";
import { useState as D, useCallback as m, useEffect as T, useLayoutEffect as Pe, useRef as P, useContext as Te } from "react";
import { f as B, D as ge, u as we, r as Oe, b as Ae } from "./config-BS7uiZu2.js";
const W = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), pe(e);
}, pe = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), le = async (e) => {
  const t = new TextEncoder().encode(e), o = await crypto.subtle.digest("SHA-256", t);
  return pe(o);
}, Ie = (e) => Math.round(Date.now() / 1e3 + Number(e)), ee = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, Y = typeof window < "u", Le = (e, r) => {
  if (!Y)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function E(e, r) {
  const [t, o] = D(
    () => Le(e, r)
  ), u = m(
    (s) => {
      try {
        o(s), Y && sessionStorage.setItem(e, JSON.stringify(s));
      } catch (a) {
        console.error(a);
      }
    },
    [e]
  );
  return T(() => {
    if (!Y)
      return;
    const s = sessionStorage.getItem(e);
    if (s)
      try {
        o(JSON.parse(s));
      } catch (a) {
        console.error(a);
      }
  }, []), T(() => {
    if (!Y)
      return;
    const s = (a) => {
      if (a.storageArea === window.sessionStorage && a.key === e)
        if (a.newValue === null)
          o(r);
        else
          try {
            o(JSON.parse(a.newValue));
          } catch {
            console.warn(
              `Failed to handle storageEvent's newValue='${a.newValue}' for key '${e}'`
            );
          }
    };
    return window.addEventListener("storage", s, !1), () => window.removeEventListener("storage", s, !1);
  }, [e, r]), [t, u];
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
  let u;
  try {
    u = Ne(o);
  } catch (s) {
    throw new N(`Invalid token specified: invalid base64 for part #${t + 1} (${s.message})`);
  }
  try {
    return JSON.parse(u);
  } catch (s) {
    throw new N(`Invalid token specified: invalid json for part #${t + 1} (${s.message})`);
  }
}
const De = typeof window < "u" ? Pe : T;
function Me(e, r, t = [], o, u) {
  const s = P(e);
  De(() => {
    s.current = e;
  }, t), T(() => {
    if (!r && r !== 0)
      return;
    const a = o(() => {
      s.current();
    }, r);
    return () => {
      u(a);
    };
  }, [r]);
}
function $e(e, r, t = []) {
  Me(e, r, t, setInterval, clearInterval);
}
function Ue(e) {
  return (e == null ? void 0 : e.prompt) !== void 0;
}
function Ve(e) {
  return !!e.accessToken && ee(e.expiresIn);
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
const re = "deva:silent-login-callback", je = [
  "login_required",
  "consent_required",
  "interaction_required"
], Fe = (e) => typeof e == "object" && e !== null, He = (e) => !Fe(e) || e.type !== re || typeof e.state != "string" ? !1 : typeof e.code == "string" && e.code.length > 0 || typeof e.error == "string" && e.error.length > 0, qe = (e) => je.includes(e);
function Je(e) {
  if (e.parent === e)
    return !1;
  const r = new URLSearchParams(e.location.search), t = r.get("state") ?? "", o = r.get("code"), u = r.get("error");
  let s = null;
  return o ? s = {
    type: re,
    code: o,
    state: t
  } : u && (s = {
    type: re,
    error: u,
    error_description: r.get("error_description") ?? void 0,
    state: t
  }), s ? (e.parent.postMessage(s, e.location.origin), !0) : !1;
}
function We(e) {
  return new Promise((r, t) => {
    const o = e.browserDocument.createElement("iframe");
    o.style.display = "none", o.setAttribute("aria-hidden", "true"), o.tabIndex = -1, o.title = "Deva silent sign-in";
    let u = !1;
    const s = () => {
      e.browserWindow.clearTimeout(_), e.browserWindow.removeEventListener("message", i), o.remove();
    }, a = () => u ? !1 : (u = !0, s(), !0), d = (c) => {
      a() && r(c);
    }, S = (c) => {
      a() && t(c);
    }, i = (c) => {
      if (!(c.origin !== e.callbackOrigin || c.source !== o.contentWindow || !He(c.data) || c.data.state !== e.expectedState)) {
        if ("code" in c.data) {
          d({ status: "success", code: c.data.code });
          return;
        }
        if (qe(c.data.error)) {
          d({ status: "no_session", error: c.data.error });
          return;
        }
        S(
          new Error(
            c.data.error_description ?? `Silent login failed: ${c.data.error}`
          )
        );
      }
    };
    e.browserWindow.addEventListener("message", i);
    const _ = e.browserWindow.setTimeout(
      () => d({ status: "timeout" }),
      e.timeoutMs
    );
    o.src = e.authorizeUrl;
    try {
      e.browserDocument.body.appendChild(o);
    } catch (c) {
      S(
        c instanceof Error ? c : new Error("Unable to create the silent login iframe")
      );
    }
  });
}
const G = typeof window < "u" && typeof document < "u", C = (...e) => {
  console.log("[sdk/provider]", ...e);
}, Be = (e) => {
  const { data: r, error: t, isLoading: o } = we(
    G ? `${e}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: r, isOpenIdConfigLoading: o, error: t };
}, Ye = (e, r) => {
  const { data: t, error: o, isLoading: u } = we(
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
    isUserInfoLoading: u,
    userInfoError: o
  };
}, Ge = (e, r, t) => m(async () => {
  if (!r || !t) {
    C("no refresh token or token endpoint");
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
}, [r, e, t]), Ke = (e, r, t) => m(async () => {
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
  baseUrl: u,
  onLoginComplete: s,
  scopes: a
}) {
  const d = Oe(o, u), S = P(s);
  S.current = s;
  const { openIdConfig: i, isOpenIdConfigLoading: _, error: c } = Be(d);
  c && console.error("[sdk/provider] error fetching openid info: ", c);
  const K = P(!1), te = P(!1), ne = P(!1);
  T(() => {
    o === "development" && !ne.current && (ne.current = !0, console.warn(
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
  const [me, M] = E("code_verifier", ""), [ye, $] = E(
    "oauth_state",
    null
  ), [Se, U] = E(
    "oauth_caller_state",
    null
  ), [Q, A] = E(
    "auth_in_progress",
    !1
  ), [ke, V] = E("id_token", null), [g, z] = E(
    "access_token",
    null
  ), [b, j] = E(
    "refresh_token",
    null
  ), [R, F] = E("expires_in", 0), [oe, y] = D(!0), v = m(
    (n) => {
      let l = R;
      z(n.access_token), V(n.id_token);
      try {
        const h = Ce(n.id_token);
        l = Math.round(Number(h.exp) - Date.now() / 1e3);
      } catch (h) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${h.message}`
        );
      }
      const f = n.expires_in ?? l;
      F(Ie(f)), j(n.refresh_token);
    },
    [z, V, F, j, R]
  ), [_e, I] = D(null), { userInfo: ve } = Ye(
    i == null ? void 0 : i.userinfo_endpoint,
    g
  ), L = m(() => {
    M(""), A(!1), $(null), U(null);
  }, [M, A, $, U]), O = m(() => {
    L(), z(""), V(""), F(0), j("");
  }, [
    L,
    z,
    V,
    F,
    j
  ]), se = Ke(
    g,
    e,
    i == null ? void 0 : i.revocation_endpoint
  ), ae = m(async () => {
    await se(), O(), I(null);
  }, [O, se]), x = Ge(
    e,
    b,
    i == null ? void 0 : i.token_endpoint
  ), ie = m(
    async (n) => {
      const l = Ue(n);
      if (!l && g && !ee(R))
        return;
      if (!l && b) {
        if (_)
          return;
        y(!0);
        try {
          const p = await x();
          if (p) {
            v(p), k.current = 0;
            return;
          }
        } catch (p) {
          console.error(
            "[sdk/provider]: Error refreshing token during login",
            p
          );
        } finally {
          y(!1);
        }
        try {
          await new Promise((J) => setTimeout(J, 2e3)), y(!0);
          const p = await x();
          if (p) {
            v(p), k.current = 0;
            return;
          }
        } catch (p) {
          console.error("[sdk/provider]: Retry refresh also failed", p);
        } finally {
          y(!1);
        }
      }
      if (l || O(), A(!0), _)
        return;
      const f = W(), h = W(), w = await le(f);
      M(f), $(h), U((n == null ? void 0 : n.state) ?? null);
      const q = fe({
        authorizationEndpoint: (i == null ? void 0 : i.authorization_endpoint) ?? "",
        clientId: e,
        redirectUri: r,
        codeChallenge: w,
        scopes: (n == null ? void 0 : n.scopes) ?? a,
        loginHint: n == null ? void 0 : n.loginHint,
        provider: n == null ? void 0 : n.provider,
        prompt: n == null ? void 0 : n.prompt,
        state: h
      });
      window.location.assign(q);
    },
    [
      g,
      R,
      b,
      x,
      v,
      y,
      e,
      a,
      r,
      M,
      $,
      U,
      O,
      A,
      _,
      i
    ]
  ), ce = m(
    async (n) => {
      if (typeof window > "u" || typeof document > "u" || !document.body)
        return { status: "unsupported" };
      const l = i ?? await B(
        `${d}/.well-known/openid-configuration`
      );
      if (!l.authorization_endpoint || !l.token_endpoint)
        return { status: "unsupported" };
      const f = W(), h = W(), w = await le(f), q = fe({
        authorizationEndpoint: l.authorization_endpoint,
        clientId: e,
        redirectUri: r,
        codeChallenge: w,
        scopes: (n == null ? void 0 : n.scopes) ?? a,
        loginHint: n == null ? void 0 : n.loginHint,
        provider: n == null ? void 0 : n.provider,
        prompt: "none",
        state: h
      }), p = new URL(r, window.location.href).origin, J = (n == null ? void 0 : n.timeoutMs) ?? 5e3, be = Number.isFinite(J) ? Math.max(0, J) : 5e3, Z = await We({
        authorizeUrl: q,
        callbackOrigin: p,
        expectedState: h,
        timeoutMs: be,
        browserWindow: window,
        browserDocument: document
      });
      if (Z.status !== "success")
        return Z;
      const de = await B(l.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: e,
          redirect_uri: r,
          code: Z.code,
          code_verifier: f,
          grant_type: "authorization_code"
        })
      });
      return he(S.current, {
        ...de,
        state: null
      }) && v(de), I(null), { status: "success" };
    },
    [e, i, v, r, d, a]
  ), k = P(0), ue = P(0), X = m(
    async (n = !1) => {
      if (!g) {
        C("no access token");
        return;
      }
      if (!ee(R) && !n) {
        k.current = 0;
        return;
      }
      if (oe && !n) {
        C("already refreshing");
        return;
      }
      if (!b) {
        C("no refresh token");
        return;
      }
      const l = k.current;
      if (l > 0 && !n) {
        const f = Math.min(
          1e3 * Math.pow(2, l),
          3e5
        );
        if (Date.now() - ue.current < f)
          return;
      }
      ue.current = Date.now(), y(!0);
      try {
        const f = await x();
        f ? (v(f), k.current = 0) : (k.current++, C(
          `refresh returned empty response (attempt ${k.current})`
        ));
      } catch (f) {
        k.current++, console.error(
          `[sdk/provider]: Error refreshing token (attempt ${k.current})`,
          f
        );
      } finally {
        y(!1);
      }
    },
    [
      g,
      b,
      x,
      v,
      oe,
      R,
      y
    ]
  ), Ee = 1e4 * Math.random();
  $e(
    () => {
      X();
    },
    G && b ? 1e4 + Ee : null,
    [X]
  ), T(() => {
    !G || window.parent === window || (te.current = Je(window));
  }, []), T(() => {
    let n = "";
    if (G && !te.current && !_) {
      if (Q) {
        y(!1);
        const l = new URLSearchParams(window.location.search);
        n = l.get("code") ?? "";
        const f = l.get("state");
        if (!n) {
          const w = l.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${w}
Expected  to find a '?code=' parameter in the URL but found none`
          ), I(w), g ? L() : O();
          return;
        }
        const h = ze({
          returnedState: f,
          expectedState: ye,
          callerState: Se
        });
        if (!h.ok) {
          console.error(`[sdk/provider]: ${h.error}`), I("Invalid OAuth state"), g ? L() : O(), window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return;
        }
        if (A(!1), K.current)
          return;
        K.current = !0, B((i == null ? void 0 : i.token_endpoint) ?? "", {
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
        }).then((w) => {
          he(S.current, {
            ...w,
            state: h.callerState
          }) ? v(w) : K.current = !1, L();
        }).catch((w) => {
          console.error("[sdk/provider]: error in fetching", w), I("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      Ve({ accessToken: g, expiresIn: R }) ? X(!0) : y(!1);
    }
  }, [_]);
  const H = {
    // A present access token means authenticated. Do NOT couple this to
    // `isRefreshing`: the proactive background refresh sets isRefreshing=true
    // for the token round-trip (~once per access-token lifetime, ~15min), and
    // gating isAuthenticated on it transiently de-authenticated the whole app
    // mid-refresh — consumers (e.g. neweco.ai) flipped their auth-gated UI to
    // the logged-out view and back, the "page refreshes every ~15min" bug.
    // The user becomes unauthenticated only when the token is cleared
    // (terminal refresh failure / logout), which nulls accessToken. See #19.
    isAuthenticated: !!g,
    accessToken: g,
    user: ve ?? null,
    login: ie,
    trySilentLogin: ce,
    logout: ae,
    isReady: !_ && !Q
  };
  return /* @__PURE__ */ Re(
    ge.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: o,
        login: ie,
        trySilentLogin: ce,
        logout: ae,
        authInProgress: Q,
        authError: _e,
        idToken: ke,
        accessToken: g,
        refreshToken: b,
        user: H.user,
        isAuthenticated: H.isAuthenticated,
        isReady: H.isReady,
        url: d
      },
      children: typeof t == "function" ? t(H) : t
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
function or({
  endpoint: e = "/api/deva/chat"
} = {}) {
  const [r, t] = D(0), [o, u] = D(null);
  return { chat: m(
    async (a) => {
      t((d) => d + 1), u(null);
      try {
        if (!e.startsWith("/") || e.startsWith("//") || e.includes("\\"))
          throw new Error("Deva AI endpoint must be a same-origin path");
        const d = await fetch(e, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          redirect: "error",
          body: JSON.stringify({
            model: a.model ?? "user-default",
            messages: a.messages,
            ...a.max_tokens === void 0 ? {} : { max_tokens: a.max_tokens }
          })
        });
        if (!d.ok)
          throw new Error(`Chat request failed (${d.status})`);
        return await d.json();
      } catch (d) {
        const S = d instanceof Error ? d : new Error("Chat request failed");
        throw u(S), S;
      } finally {
        t((d) => d - 1);
      }
    },
    [e]
  ), loading: r > 0, error: o };
}
const Qe = "AI_COMPLETIONS", sr = {
  [Qe]: "Use your Deva credits for AI, up to the monthly limit you approve."
};
export {
  Qe as AI_COMPLETIONS,
  tr as DevaProvider,
  sr as SCOPE_INFO,
  nr as useDeva,
  or as useDevaAI
};
