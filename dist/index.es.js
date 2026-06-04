import { jsx as ie } from "react/jsx-runtime";
import { useState as F, useCallback as m, useEffect as T, useLayoutEffect as ue, useRef as S, useContext as de } from "react";
import { f as X, D as Z, u as ee, r as fe } from "./config-DtnqZvjP.js";
const le = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), re(e);
}, re = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), he = async (e) => {
  const t = new TextEncoder().encode(e), n = await crypto.subtle.digest("SHA-256", t);
  return re(n);
}, pe = (e) => Math.round(Date.now() / 1e3 + Number(e)), Q = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, $ = typeof window < "u", ge = (e, r) => {
  if (!$)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function E(e, r) {
  const [t, n] = F(
    () => ge(e, r)
  ), f = m(
    (s) => {
      try {
        n(s), $ && sessionStorage.setItem(e, JSON.stringify(s));
      } catch (c) {
        console.error(c);
      }
    },
    [e]
  );
  return T(() => {
    if (!$)
      return;
    const s = sessionStorage.getItem(e);
    if (s)
      try {
        n(JSON.parse(s));
      } catch (c) {
        console.error(c);
      }
  }, []), T(() => {
    if (!$)
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
class A extends Error {
}
A.prototype.name = "InvalidTokenError";
function we(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (r, t) => {
    let n = t.charCodeAt(0).toString(16).toUpperCase();
    return n.length < 2 && (n = "0" + n), "%" + n;
  }));
}
function me(e) {
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
    return we(r);
  } catch {
    return atob(r);
  }
}
function ye(e, r) {
  if (typeof e != "string")
    throw new A("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, n = e.split(".")[t];
  if (typeof n != "string")
    throw new A(`Invalid token specified: missing part #${t + 1}`);
  let f;
  try {
    f = me(n);
  } catch (s) {
    throw new A(`Invalid token specified: invalid base64 for part #${t + 1} (${s.message})`);
  }
  try {
    return JSON.parse(f);
  } catch (s) {
    throw new A(`Invalid token specified: invalid json for part #${t + 1} (${s.message})`);
  }
}
const ke = typeof window < "u" ? ue : T;
function ve(e, r, t = [], n, f) {
  const s = S(e);
  ke(() => {
    s.current = e;
  }, t), T(() => {
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
function _e(e, r, t = []) {
  ve(e, r, t, setInterval, clearInterval);
}
function Re(e) {
  return (e == null ? void 0 : e.prompt) !== void 0;
}
function Ee(e) {
  const r = new URL(e.authorizationEndpoint);
  return r.searchParams.append("client_id", e.clientId), r.searchParams.append("redirect_uri", e.redirectUri), r.searchParams.append("response_type", "code"), r.searchParams.append("code_challenge", e.codeChallenge), r.searchParams.append("code_challenge_method", "S256"), e.prompt && r.searchParams.append("prompt", e.prompt), e.state && r.searchParams.append("state", e.state), r.toString();
}
function Se(e, r) {
  return (e == null ? void 0 : e(r)) !== !0;
}
const J = typeof window < "u" && typeof document < "u", I = (...e) => {
  console.log("[sdk/provider]", ...e);
}, Te = (e) => {
  const { data: r, error: t, isLoading: n } = ee(
    J ? `${e}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: r, isOpenIdConfigLoading: n, error: t };
}, Pe = (e, r) => {
  const { data: t, error: n, isLoading: f } = ee(
    r ? e : !1,
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    }
  );
  return {
    userInfo: t,
    isUserInfoLoading: f,
    userInfoError: n
  };
}, be = (e, r, t) => m(async () => {
  if (!r || !t) {
    I("no refresh token or token endpoint");
    return;
  }
  return X(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: e,
      refresh_token: r
    })
  });
}, [r, e, t]), Ae = (e, r, t) => m(async () => {
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
function De({
  clientId: e,
  redirectUri: r,
  children: t,
  env: n,
  baseUrl: f,
  onLoginComplete: s
}) {
  const c = fe(n, f), j = S(s);
  j.current = s;
  const { openIdConfig: a, isOpenIdConfigLoading: k, error: B } = Te(c);
  B && console.error("[sdk/provider] error fetching openid info: ", B);
  const U = S(!1), W = S(!1);
  T(() => {
    n === "development" && !W.current && (W.current = !0, console.warn(
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
  const [te, w] = E("code_verifier", ""), [C, v] = E(
    "auth_in_progress",
    !1
  ), [ne, N] = E("id_token", null), [l, x] = E(
    "access_token",
    null
  ), [y, D] = E(
    "refresh_token",
    null
  ), [_, O] = E("expires_in", 0), [V, h] = F(!0), R = m(
    (o) => {
      let u = _;
      x(o.access_token), N(o.id_token);
      try {
        const i = ye(o.id_token);
        u = Math.round(Number(i.exp) - Date.now() / 1e3);
      } catch (i) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${i.message}`
        );
      }
      const d = o.expires_in ?? u;
      O(pe(d)), D(o.refresh_token), w("");
    },
    [
      x,
      N,
      O,
      D,
      w,
      _
    ]
  ), [oe, M] = F(null), { userInfo: se } = Pe(
    a == null ? void 0 : a.userinfo_endpoint,
    V ? null : l
  ), P = m(() => {
    w(""), v(!1), x(""), N(""), O(0), D("");
  }, [
    w,
    v,
    x,
    N,
    O,
    D
  ]), H = Ae(
    l,
    e,
    a == null ? void 0 : a.revocation_endpoint
  ), Y = m(async () => {
    await H(), P(), M(null);
  }, [P, H]), b = be(
    e,
    y,
    a == null ? void 0 : a.token_endpoint
  ), G = m(async (o) => {
    const u = Re(o);
    if (!u && l && !Q(_))
      return;
    if (!u && y) {
      if (k)
        return;
      h(!0);
      try {
        const g = await b();
        if (g) {
          R(g), p.current = 0;
          return;
        }
      } catch (g) {
        console.error("[sdk/provider]: Error refreshing token during login", g);
      } finally {
        h(!1);
      }
      try {
        await new Promise((ce) => setTimeout(ce, 2e3)), h(!0);
        const g = await b();
        if (g) {
          R(g), p.current = 0;
          return;
        }
      } catch (g) {
        console.error("[sdk/provider]: Retry refresh also failed", g);
      } finally {
        h(!1);
      }
    }
    if (u || P(), v(!0), k)
      return;
    const d = le(), i = await he(d);
    w(d);
    const K = Ee({
      authorizationEndpoint: (a == null ? void 0 : a.authorization_endpoint) ?? "",
      clientId: e,
      redirectUri: r,
      codeChallenge: i,
      prompt: o == null ? void 0 : o.prompt,
      state: o == null ? void 0 : o.state
    });
    window.location.assign(K);
  }, [
    l,
    _,
    y,
    b,
    R,
    h,
    e,
    r,
    w,
    P,
    v,
    k,
    a
  ]), p = S(0), q = S(0), z = m(
    async (o = !1) => {
      if (!l) {
        I("no access token");
        return;
      }
      if (!Q(_) && !o) {
        p.current = 0;
        return;
      }
      if (V && !o) {
        I("already refreshing");
        return;
      }
      if (!y) {
        I("no refresh token");
        return;
      }
      const u = p.current;
      if (u > 0 && !o) {
        const d = Math.min(1e3 * Math.pow(2, u), 3e5);
        if (Date.now() - q.current < d)
          return;
      }
      q.current = Date.now(), h(!0);
      try {
        const d = await b();
        d ? (R(d), p.current = 0) : (p.current++, I(`refresh returned empty response (attempt ${p.current})`));
      } catch (d) {
        p.current++, console.error(`[sdk/provider]: Error refreshing token (attempt ${p.current})`, d);
      } finally {
        h(!1);
      }
    },
    [
      l,
      y,
      b,
      R,
      V,
      _,
      h
    ]
  ), ae = 1e4 * Math.random();
  _e(
    () => {
      z();
    },
    J && y ? 1e4 + ae : null,
    [z]
  ), T(() => {
    let o = "";
    if (J && !k) {
      if (C) {
        h(!1);
        const u = new URLSearchParams(window.location.search);
        o = u.get("code") ?? "";
        const d = u.get("state");
        if (!o) {
          const i = u.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${i}
Expected  to find a '?code=' parameter in the URL but found none`
          ), M(i), l ? (v(!1), w("")) : P();
          return;
        }
        if (v(!1), U.current)
          return;
        U.current = !0, X((a == null ? void 0 : a.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: o,
            code_verifier: te,
            grant_type: "authorization_code"
          })
        }).then((i) => {
          Se(j.current, {
            ...i,
            state: d
          }) ? R(i) : (U.current = !1, w(""));
        }).catch((i) => {
          console.error("[sdk/provider]: error in fetching", i), M("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      z(!0);
    }
  }, [k]);
  const L = {
    // A present access token means authenticated. Do NOT couple this to
    // `isRefreshing`: the proactive background refresh sets isRefreshing=true
    // for the token round-trip (~once per access-token lifetime, ~15min), and
    // gating isAuthenticated on it transiently de-authenticated the whole app
    // mid-refresh — consumers (e.g. neweco.ai) flipped their auth-gated UI to
    // the logged-out view and back, the "page refreshes every ~15min" bug.
    // The user becomes unauthenticated only when the token is cleared
    // (terminal refresh failure / logout), which nulls accessToken. See #19.
    isAuthenticated: !!l,
    accessToken: l,
    user: se ?? null,
    login: G,
    logout: Y,
    isReady: !k && !C
  };
  return /* @__PURE__ */ ie(
    Z.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: n,
        login: G,
        logout: Y,
        authInProgress: C,
        authError: oe,
        idToken: ne,
        accessToken: l,
        refreshToken: y,
        user: L.user,
        isAuthenticated: L.isAuthenticated,
        isReady: L.isReady,
        url: c
      },
      children: typeof t == "function" ? t(L) : t
    }
  );
}
const Oe = () => {
  const e = de(Z);
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
  De as DevaProvider,
  Oe as useDeva
};
