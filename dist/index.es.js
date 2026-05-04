import { jsx as ae } from "react/jsx-runtime";
import { useState as M, useCallback as p, useEffect as R, useLayoutEffect as ce, useRef as b, useContext as ie } from "react";
import { f as q, D as K, u as Q, e as X } from "./config-CL6PuR8K.js";
const ue = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), Z(e);
}, Z = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), de = async (e) => {
  const t = new TextEncoder().encode(e), o = await crypto.subtle.digest("SHA-256", t);
  return Z(o);
}, fe = (e) => Math.round(Date.now() / 1e3 + Number(e)), G = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, C = typeof window < "u", le = (e, r) => {
  if (!C)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function _(e, r) {
  const [t, o] = M(
    () => le(e, r)
  ), i = p(
    (n) => {
      try {
        o(n), C && sessionStorage.setItem(e, JSON.stringify(n));
      } catch (a) {
        console.error(a);
      }
    },
    [e]
  );
  return R(() => {
    if (!C)
      return;
    const n = sessionStorage.getItem(e);
    if (n)
      try {
        o(JSON.parse(n));
      } catch (a) {
        console.error(a);
      }
  }, []), R(() => {
    if (!C)
      return;
    const n = (a) => {
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
    return window.addEventListener("storage", n, !1), () => window.removeEventListener("storage", n, !1);
  }, [e, r]), [t, i];
}
class P extends Error {
}
P.prototype.name = "InvalidTokenError";
function he(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (r, t) => {
    let o = t.charCodeAt(0).toString(16).toUpperCase();
    return o.length < 2 && (o = "0" + o), "%" + o;
  }));
}
function pe(e) {
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
    return he(r);
  } catch {
    return atob(r);
  }
}
function ge(e, r) {
  if (typeof e != "string")
    throw new P("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, o = e.split(".")[t];
  if (typeof o != "string")
    throw new P(`Invalid token specified: missing part #${t + 1}`);
  let i;
  try {
    i = pe(o);
  } catch (n) {
    throw new P(`Invalid token specified: invalid base64 for part #${t + 1} (${n.message})`);
  }
  try {
    return JSON.parse(i);
  } catch (n) {
    throw new P(`Invalid token specified: invalid json for part #${t + 1} (${n.message})`);
  }
}
const we = typeof window < "u" ? ce : R;
function me(e, r, t = [], o, i) {
  const n = b(e);
  we(() => {
    n.current = e;
  }, t), R(() => {
    if (!r && r !== 0)
      return;
    const a = o(() => {
      n.current();
    }, r);
    return () => {
      i(a);
    };
  }, [r]);
}
function ye(e, r, t = []) {
  me(e, r, t, setInterval, clearInterval);
}
const J = typeof window < "u" && typeof document < "u", A = (...e) => {
  console.log("[sdk/provider]", ...e);
}, ke = (e) => {
  const r = X(e), { data: t, error: o, isLoading: i } = Q(
    J ? `${r}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: t, isOpenIdConfigLoading: i, error: o };
}, ve = (e, r) => {
  const { data: t, error: o, isLoading: i } = Q(
    r ? e : !1,
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    }
  );
  return {
    userInfo: t,
    isUserInfoLoading: i,
    userInfoError: o
  };
}, _e = (e, r, t) => p(async () => {
  if (!r || !t) {
    A("no refresh token or token endpoint");
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
}, [r, e, t]), Re = (e, r, t) => p(async () => {
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
function be({
  clientId: e,
  redirectUri: r,
  children: t,
  env: o
}) {
  const i = X(o), { openIdConfig: n, isOpenIdConfigLoading: a, error: F } = ke(o);
  F && console.error("[sdk/provider] error fetching openid info: ", F);
  const j = b(!1), z = b(!1);
  R(() => {
    o === "development" && !z.current && (z.current = !0, console.warn(
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
  const [ee, m] = _("code_verifier", ""), [$, E] = _(
    "auth_in_progress",
    !1
  ), [re, I] = _("id_token", null), [d, L] = _(
    "access_token",
    null
  ), [g, N] = _(
    "refresh_token",
    null
  ), [y, x] = _("expires_in", 0), [D, f] = M(!0), k = p(
    (s) => {
      let u = y;
      L(s.access_token), I(s.id_token);
      try {
        const v = ge(s.id_token);
        u = Math.round(Number(v.exp) - Date.now() / 1e3);
      } catch (v) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${v.message}`
        );
      }
      const c = s.expires_in ?? u;
      x(fe(c)), N(s.refresh_token), m("");
    },
    [
      L,
      I,
      x,
      N,
      m,
      y
    ]
  ), [te, U] = M(null), { userInfo: ne } = ve(
    n == null ? void 0 : n.userinfo_endpoint,
    D ? null : d
  ), S = p(() => {
    m(""), E(!1), L(""), I(""), x(0), N("");
  }, [
    m,
    E,
    L,
    I,
    x,
    N
  ]), B = Re(
    d,
    e,
    n == null ? void 0 : n.revocation_endpoint
  ), W = p(async () => {
    await B(), S(), U(null);
  }, [S, B]), T = _e(
    e,
    g,
    n == null ? void 0 : n.token_endpoint
  ), H = p(async (s) => {
    const u = (s == null ? void 0 : s.prompt) !== void 0;
    if (!u && d && !G(y))
      return;
    if (!u && g) {
      if (a)
        return;
      f(!0);
      try {
        const h = await T();
        if (h) {
          k(h), l.current = 0;
          return;
        }
      } catch (h) {
        console.error("[sdk/provider]: Error refreshing token during login", h);
      } finally {
        f(!1);
      }
      try {
        await new Promise((se) => setTimeout(se, 2e3)), f(!0);
        const h = await T();
        if (h) {
          k(h), l.current = 0;
          return;
        }
      } catch (h) {
        console.error("[sdk/provider]: Retry refresh also failed", h);
      } finally {
        f(!1);
      }
    }
    if (S(), E(!0), a)
      return;
    const c = ue(), v = await de(c);
    m(c);
    const w = new URL((n == null ? void 0 : n.authorization_endpoint) ?? "");
    w.searchParams.append("client_id", e), w.searchParams.append("redirect_uri", r), w.searchParams.append("response_type", "code"), w.searchParams.append("code_challenge", v), w.searchParams.append("code_challenge_method", "S256"), s != null && s.prompt && w.searchParams.append("prompt", s.prompt), window.location.assign(w.toString());
  }, [
    d,
    y,
    g,
    T,
    k,
    f,
    e,
    r,
    m,
    S,
    E,
    a,
    n
  ]), l = b(0), Y = b(0), V = p(
    async (s = !1) => {
      if (!d) {
        A("no access token");
        return;
      }
      if (!G(y) && !s) {
        l.current = 0;
        return;
      }
      if (D && !s) {
        A("already refreshing");
        return;
      }
      if (!g) {
        A("no refresh token");
        return;
      }
      const u = l.current;
      if (u > 0 && !s) {
        const c = Math.min(1e3 * Math.pow(2, u), 3e5);
        if (Date.now() - Y.current < c)
          return;
      }
      Y.current = Date.now(), f(!0);
      try {
        const c = await T();
        c ? (k(c), l.current = 0) : (l.current++, A(`refresh returned empty response (attempt ${l.current})`));
      } catch (c) {
        l.current++, console.error(`[sdk/provider]: Error refreshing token (attempt ${l.current})`, c);
      } finally {
        f(!1);
      }
    },
    [
      d,
      g,
      T,
      k,
      D,
      y,
      f
    ]
  ), oe = 1e4 * Math.random();
  ye(
    () => {
      V();
    },
    J && g ? 1e4 + oe : null,
    [V]
  ), R(() => {
    let s = "";
    if (J && !a) {
      if ($) {
        f(!1);
        const u = new URLSearchParams(window.location.search);
        if (s = u.get("code") ?? "", !s) {
          const c = u.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${c}
Expected  to find a '?code=' parameter in the URL but found none`
          ), U(c), S();
          return;
        }
        if (E(!1), j.current)
          return;
        j.current = !0, q((n == null ? void 0 : n.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: s,
            code_verifier: ee,
            grant_type: "authorization_code"
          })
        }).then(k).catch((c) => {
          console.error("[sdk/provider]: error in fetching", c), U("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      V(!0);
    }
  }, [a]);
  const O = {
    isAuthenticated: !!d && !D,
    accessToken: d,
    user: ne ?? null,
    login: H,
    logout: W,
    isReady: !a && !$
  };
  return /* @__PURE__ */ ae(
    K.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: o,
        login: H,
        logout: W,
        authInProgress: $,
        authError: te,
        idToken: re,
        accessToken: d,
        refreshToken: g,
        user: O.user,
        isAuthenticated: O.isAuthenticated,
        isReady: O.isReady,
        url: i
      },
      children: typeof t == "function" ? t(O) : t
    }
  );
}
const Pe = () => {
  const e = ie(K);
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
  be as DevaProvider,
  Pe as useDeva
};
