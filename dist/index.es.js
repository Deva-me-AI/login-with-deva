import { jsx as we } from "react/jsx-runtime";
import { useState as B, useCallback as m, useEffect as O, useLayoutEffect as ge, useRef as P, useContext as me } from "react";
import { f as ne, D as oe, u as se, r as ye } from "./config-atmkCy3Z.js";
const re = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), ae(e);
}, ae = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), ke = async (e) => {
  const t = new TextEncoder().encode(e), n = await crypto.subtle.digest("SHA-256", t);
  return ae(n);
}, ve = (e) => Math.round(Date.now() / 1e3 + Number(e)), te = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, z = typeof window < "u", Se = (e, r) => {
  if (!z)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function y(e, r) {
  const [t, n] = B(
    () => Se(e, r)
  ), f = m(
    (s) => {
      try {
        n(s), z && sessionStorage.setItem(e, JSON.stringify(s));
      } catch (c) {
        console.error(c);
      }
    },
    [e]
  );
  return O(() => {
    if (!z)
      return;
    const s = sessionStorage.getItem(e);
    if (s)
      try {
        n(JSON.parse(s));
      } catch (c) {
        console.error(c);
      }
  }, []), O(() => {
    if (!z)
      return;
    const s = (c) => {
      if (c.storageArea === window.sessionStorage && c.key === e)
        if (c.newValue === null)
          n(r);
        else
          try {
            n(JSON.parse(c.newValue));
          } catch {
            console.warn(
              `Failed to handle storageEvent's newValue='${c.newValue}' for key '${e}'`
            );
          }
    };
    return window.addEventListener("storage", s, !1), () => window.removeEventListener("storage", s, !1);
  }, [e, r]), [t, f];
}
class N extends Error {
}
N.prototype.name = "InvalidTokenError";
function _e(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (r, t) => {
    let n = t.charCodeAt(0).toString(16).toUpperCase();
    return n.length < 2 && (n = "0" + n), "%" + n;
  }));
}
function Re(e) {
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
    return _e(r);
  } catch {
    return atob(r);
  }
}
function Ee(e, r) {
  if (typeof e != "string")
    throw new N("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, n = e.split(".")[t];
  if (typeof n != "string")
    throw new N(`Invalid token specified: missing part #${t + 1}`);
  let f;
  try {
    f = Re(n);
  } catch (s) {
    throw new N(`Invalid token specified: invalid base64 for part #${t + 1} (${s.message})`);
  }
  try {
    return JSON.parse(f);
  } catch (s) {
    throw new N(`Invalid token specified: invalid json for part #${t + 1} (${s.message})`);
  }
}
const Te = typeof window < "u" ? ge : O;
function Ae(e, r, t = [], n, f) {
  const s = P(e);
  Te(() => {
    s.current = e;
  }, t), O(() => {
    if (!r && r !== 0)
      return;
    const c = n(() => {
      s.current();
    }, r);
    return () => {
      f(c);
    };
  }, [r]);
}
function Pe(e, r, t = []) {
  Ae(e, r, t, setInterval, clearInterval);
}
function Oe(e) {
  return (e == null ? void 0 : e.prompt) !== void 0;
}
function be(e) {
  if (!e.state)
    throw new Error("OAuth state is required");
  const r = new URL(e.authorizationEndpoint);
  return r.searchParams.append("client_id", e.clientId), r.searchParams.append("redirect_uri", e.redirectUri), r.searchParams.append("response_type", "code"), r.searchParams.append("code_challenge", e.codeChallenge), r.searchParams.append("code_challenge_method", "S256"), e.prompt && r.searchParams.append("prompt", e.prompt), r.searchParams.append("state", e.state), r.toString();
}
function Ie(e) {
  return e.expectedState ? e.returnedState ? e.returnedState !== e.expectedState ? { ok: !1, error: "OAuth state mismatch" } : { ok: !0, callerState: e.callerState } : { ok: !1, error: "Missing OAuth state" } : { ok: !1, error: "Missing stored OAuth state" };
}
function xe(e, r) {
  return (e == null ? void 0 : e(r)) !== !0;
}
const W = typeof window < "u" && typeof document < "u", D = (...e) => {
  console.log("[sdk/provider]", ...e);
}, Ne = (e) => {
  const { data: r, error: t, isLoading: n } = se(
    W ? `${e}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: r, isOpenIdConfigLoading: n, error: t };
}, De = (e, r) => {
  const { data: t, error: n, isLoading: f } = se(
    r ? e : !1,
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    },
    { keepPreviousData: !0 }
  );
  return {
    userInfo: t,
    isUserInfoLoading: f,
    userInfoError: n
  };
}, $e = (e, r, t) => m(async () => {
  if (!r || !t) {
    D("no refresh token or token endpoint");
    return;
  }
  return ne(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: e,
      refresh_token: r
    })
  });
}, [r, e, t]), Le = (e, r, t) => m(async () => {
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
function Me({
  clientId: e,
  redirectUri: r,
  children: t,
  env: n,
  baseUrl: f,
  onLoginComplete: s
}) {
  const c = ye(n, f), H = P(s);
  H.current = s;
  const { openIdConfig: a, isOpenIdConfigLoading: v, error: Y } = Ne(c);
  Y && console.error("[sdk/provider] error fetching openid info: ", Y);
  const F = P(!1), q = P(!1);
  O(() => {
    n === "development" && !q.current && (q.current = !0, console.warn(
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
  }, [n]);
  const [ce, S] = y("code_verifier", ""), [ie, _] = y(
    "oauth_state",
    null
  ), [ue, R] = y(
    "oauth_caller_state",
    null
  ), [J, b] = y(
    "auth_in_progress",
    !1
  ), [de, $] = y("id_token", null), [d, L] = y(
    "access_token",
    null
  ), [k, C] = y(
    "refresh_token",
    null
  ), [E, U] = y("expires_in", 0), [G, h] = B(!0), T = m(
    (o) => {
      let i = E;
      L(o.access_token), $(o.id_token);
      try {
        const l = Ee(o.id_token);
        i = Math.round(Number(l.exp) - Date.now() / 1e3);
      } catch (l) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${l.message}`
        );
      }
      const u = o.expires_in ?? i;
      U(ve(u)), C(o.refresh_token), S(""), _(null), R(null);
    },
    [
      L,
      $,
      U,
      C,
      S,
      _,
      R,
      E
    ]
  ), [le, V] = B(null), { userInfo: fe } = De(
    a == null ? void 0 : a.userinfo_endpoint,
    d
  ), I = m(() => {
    S(""), b(!1), _(null), R(null);
  }, [S, b, _, R]), A = m(() => {
    I(), L(""), $(""), U(0), C("");
  }, [
    I,
    L,
    $,
    U,
    C
  ]), K = Le(
    d,
    e,
    a == null ? void 0 : a.revocation_endpoint
  ), Q = m(async () => {
    await K(), A(), V(null);
  }, [A, K]), x = $e(
    e,
    k,
    a == null ? void 0 : a.token_endpoint
  ), X = m(
    async (o) => {
      const i = Oe(o);
      if (!i && d && !te(E))
        return;
      if (!i && k) {
        if (v)
          return;
        h(!0);
        try {
          const g = await x();
          if (g) {
            T(g), p.current = 0;
            return;
          }
        } catch (g) {
          console.error(
            "[sdk/provider]: Error refreshing token during login",
            g
          );
        } finally {
          h(!1);
        }
        try {
          await new Promise((pe) => setTimeout(pe, 2e3)), h(!0);
          const g = await x();
          if (g) {
            T(g), p.current = 0;
            return;
          }
        } catch (g) {
          console.error("[sdk/provider]: Retry refresh also failed", g);
        } finally {
          h(!1);
        }
      }
      if (i || A(), b(!0), v)
        return;
      const u = re(), l = re(), w = await ke(u);
      S(u), _(l), R((o == null ? void 0 : o.state) ?? null);
      const ee = be({
        authorizationEndpoint: (a == null ? void 0 : a.authorization_endpoint) ?? "",
        clientId: e,
        redirectUri: r,
        codeChallenge: w,
        prompt: o == null ? void 0 : o.prompt,
        state: l
      });
      window.location.assign(ee);
    },
    [
      d,
      E,
      k,
      x,
      T,
      h,
      e,
      r,
      S,
      _,
      R,
      A,
      b,
      v,
      a
    ]
  ), p = P(0), Z = P(0), j = m(
    async (o = !1) => {
      if (!d) {
        D("no access token");
        return;
      }
      if (!te(E) && !o) {
        p.current = 0;
        return;
      }
      if (G && !o) {
        D("already refreshing");
        return;
      }
      if (!k) {
        D("no refresh token");
        return;
      }
      const i = p.current;
      if (i > 0 && !o) {
        const u = Math.min(
          1e3 * Math.pow(2, i),
          3e5
        );
        if (Date.now() - Z.current < u)
          return;
      }
      Z.current = Date.now(), h(!0);
      try {
        const u = await x();
        u ? (T(u), p.current = 0) : (p.current++, D(
          `refresh returned empty response (attempt ${p.current})`
        ));
      } catch (u) {
        p.current++, console.error(
          `[sdk/provider]: Error refreshing token (attempt ${p.current})`,
          u
        );
      } finally {
        h(!1);
      }
    },
    [
      d,
      k,
      x,
      T,
      G,
      E,
      h
    ]
  ), he = 1e4 * Math.random();
  Pe(
    () => {
      j();
    },
    W && k ? 1e4 + he : null,
    [j]
  ), O(() => {
    let o = "";
    if (W && !v) {
      if (J) {
        h(!1);
        const i = new URLSearchParams(window.location.search);
        o = i.get("code") ?? "";
        const u = i.get("state");
        if (!o) {
          const w = i.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${w}
Expected  to find a '?code=' parameter in the URL but found none`
          ), V(w), d ? I() : A();
          return;
        }
        const l = Ie({
          returnedState: u,
          expectedState: ie,
          callerState: ue
        });
        if (!l.ok) {
          console.error(`[sdk/provider]: ${l.error}`), V("Invalid OAuth state"), d ? I() : A(), window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return;
        }
        if (b(!1), F.current)
          return;
        F.current = !0, ne((a == null ? void 0 : a.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: o,
            code_verifier: ce,
            grant_type: "authorization_code"
          })
        }).then((w) => {
          xe(H.current, {
            ...w,
            state: l.callerState
          }) ? T(w) : (F.current = !1, I());
        }).catch((w) => {
          console.error("[sdk/provider]: error in fetching", w), V("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      j(!0);
    }
  }, [v]);
  const M = {
    // A present access token means authenticated. Do NOT couple this to
    // `isRefreshing`: the proactive background refresh sets isRefreshing=true
    // for the token round-trip (~once per access-token lifetime, ~15min), and
    // gating isAuthenticated on it transiently de-authenticated the whole app
    // mid-refresh — consumers (e.g. neweco.ai) flipped their auth-gated UI to
    // the logged-out view and back, the "page refreshes every ~15min" bug.
    // The user becomes unauthenticated only when the token is cleared
    // (terminal refresh failure / logout), which nulls accessToken. See #19.
    isAuthenticated: !!d,
    accessToken: d,
    user: fe ?? null,
    login: X,
    logout: Q,
    isReady: !v && !J
  };
  return /* @__PURE__ */ we(
    oe.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: n,
        login: X,
        logout: Q,
        authInProgress: J,
        authError: le,
        idToken: de,
        accessToken: d,
        refreshToken: k,
        user: M.user,
        isAuthenticated: M.isAuthenticated,
        isReady: M.isReady,
        url: c
      },
      children: typeof t == "function" ? t(M) : t
    }
  );
}
const ze = () => {
  const e = me(oe);
  if (!e)
    throw new Error("useDeva must be used within a DevaProvider");
  return {
    isAuthenticated: !!e.accessToken,
    isReady: e.isReady,
    accessToken: e.accessToken,
    user: e.user,
    login: e.login,
    logout: e.logout
  };
};
export {
  Me as DevaProvider,
  ze as useDeva
};
