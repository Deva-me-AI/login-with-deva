import { jsx as oe } from "react/jsx-runtime";
import { useState as U, useCallback as p, useEffect as v, useLayoutEffect as se, useRef as S, useContext as ae } from "react";
import { f as Y, D as G, u as q, e as K } from "./config-CBh0zg_P.js";
const ce = () => {
  const e = new Uint8Array(32);
  return crypto.getRandomValues(e), Q(e);
}, Q = (e) => btoa(String.fromCharCode(...new Uint8Array(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), ie = async (e) => {
  const t = new TextEncoder().encode(e), o = await crypto.subtle.digest("SHA-256", t);
  return Q(o);
}, ue = (e) => Math.round(Date.now() / 1e3 + Number(e)), H = (e) => Math.round(Date.now()) / 1e3 + 60 >= e, D = typeof window < "u", de = (e, r) => {
  if (!D)
    return r;
  try {
    const t = sessionStorage.getItem(e);
    return t ? JSON.parse(t) : r;
  } catch (t) {
    return console.error(t), r;
  }
};
function k(e, r) {
  const [t, o] = U(
    () => de(e, r)
  ), u = p(
    (n) => {
      try {
        o(n), D && sessionStorage.setItem(e, JSON.stringify(n));
      } catch (a) {
        console.error(a);
      }
    },
    [e]
  );
  return v(() => {
    if (!D)
      return;
    const n = sessionStorage.getItem(e);
    if (n)
      try {
        o(JSON.parse(n));
      } catch (a) {
        console.error(a);
      }
  }, []), v(() => {
    if (!D)
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
  }, [e, r]), [t, u];
}
class T extends Error {
}
T.prototype.name = "InvalidTokenError";
function fe(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (r, t) => {
    let o = t.charCodeAt(0).toString(16).toUpperCase();
    return o.length < 2 && (o = "0" + o), "%" + o;
  }));
}
function le(e) {
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
    return fe(r);
  } catch {
    return atob(r);
  }
}
function he(e, r) {
  if (typeof e != "string")
    throw new T("Invalid token specified: must be a string");
  r || (r = {});
  const t = r.header === !0 ? 0 : 1, o = e.split(".")[t];
  if (typeof o != "string")
    throw new T(`Invalid token specified: missing part #${t + 1}`);
  let u;
  try {
    u = le(o);
  } catch (n) {
    throw new T(`Invalid token specified: invalid base64 for part #${t + 1} (${n.message})`);
  }
  try {
    return JSON.parse(u);
  } catch (n) {
    throw new T(`Invalid token specified: invalid json for part #${t + 1} (${n.message})`);
  }
}
const pe = typeof window < "u" ? se : v;
function ge(e, r, t = [], o, u) {
  const n = S(e);
  pe(() => {
    n.current = e;
  }, t), v(() => {
    if (!r && r !== 0)
      return;
    const a = o(() => {
      n.current();
    }, r);
    return () => {
      u(a);
    };
  }, [r]);
}
function we(e, r, t = []) {
  ge(e, r, t, setInterval, clearInterval);
}
const V = typeof window < "u" && typeof document < "u", b = (...e) => {
  console.log("[sdk/provider]", ...e);
}, me = (e) => {
  const r = K(e), { data: t, error: o, isLoading: u } = q(
    V ? `${r}/.well-known/openid-configuration` : null
  );
  return { openIdConfig: t, isOpenIdConfigLoading: u, error: o };
}, ye = (e, r) => {
  const { data: t, error: o, isLoading: u } = q(
    r ? e : !1,
    {
      headers: {
        Authorization: `Bearer ${r}`
      }
    }
  );
  return {
    userInfo: t,
    isUserInfoLoading: u,
    userInfoError: o
  };
}, ke = (e, r, t) => p(async () => {
  if (!r || !t) {
    b("no refresh token or token endpoint");
    return;
  }
  return Y(t, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: e,
      refresh_token: r
    })
  });
}, [r, e, t]), ve = (e, r, t) => p(async () => {
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
function Se({
  clientId: e,
  redirectUri: r,
  children: t,
  env: o
}) {
  const u = K(o), { openIdConfig: n, isOpenIdConfigLoading: a, error: M } = me(o);
  M && console.error("[sdk/provider] error fetching openid info: ", M);
  const J = S(!1), F = S(!1);
  v(() => {
    o === "development" && !F.current && (F.current = !0, console.warn(
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
  const [X, w] = k("code_verifier", ""), [O, _] = k(
    "auth_in_progress",
    !1
  ), [Z, P] = k("id_token", null), [f, A] = k(
    "access_token",
    null
  ), [g, I] = k(
    "refresh_token",
    null
  ), [m, L] = k("expires_in", 0), [N, l] = U(!0), y = p(
    (c) => {
      let d = m;
      A(c.access_token), P(c.id_token);
      try {
        const i = he(c.id_token);
        d = Math.round(Number(i.exp) - Date.now() / 1e3);
      } catch (i) {
        console.warn(
          `[sdk/provider]: Failed to decode idToken: ${i.message}`
        );
      }
      const s = c.expires_in ?? d;
      L(ue(s)), I(c.refresh_token), w("");
    },
    [
      A,
      P,
      L,
      I,
      w,
      m
    ]
  ), [ee, C] = U(null), { userInfo: re } = ye(
    n == null ? void 0 : n.userinfo_endpoint,
    N ? null : f
  ), R = p(() => {
    w(""), _(!1), A(""), P(""), L(0), I("");
  }, [
    w,
    _,
    A,
    P,
    L,
    I
  ]), j = ve(
    f,
    e,
    n == null ? void 0 : n.revocation_endpoint
  ), z = p(async () => {
    await j(), R(), C(null);
  }, [R, j]), E = ke(
    e,
    g,
    n == null ? void 0 : n.token_endpoint
  ), B = p(async () => {
    if (f && !H(m))
      return;
    if (g) {
      if (a)
        return;
      l(!0);
      try {
        const i = await E();
        if (i) {
          y(i), h.current = 0;
          return;
        }
      } catch (i) {
        console.error("[sdk/provider]: Error refreshing token during login", i);
      } finally {
        l(!1);
      }
      try {
        await new Promise((ne) => setTimeout(ne, 2e3)), l(!0);
        const i = await E();
        if (i) {
          y(i), h.current = 0;
          return;
        }
      } catch (i) {
        console.error("[sdk/provider]: Retry refresh also failed", i);
      } finally {
        l(!1);
      }
    }
    if (R(), _(!0), a)
      return;
    const c = ce(), d = await ie(c);
    w(c);
    const s = new URL((n == null ? void 0 : n.authorization_endpoint) ?? "");
    s.searchParams.append("client_id", e), s.searchParams.append("redirect_uri", r), s.searchParams.append("response_type", "code"), s.searchParams.append("code_challenge", d), s.searchParams.append("code_challenge_method", "S256"), window.location.assign(s.toString());
  }, [
    f,
    m,
    g,
    E,
    y,
    l,
    e,
    r,
    w,
    R,
    _,
    a,
    n
  ]), h = S(0), W = S(0), $ = p(
    async (c = !1) => {
      if (!f) {
        b("no access token");
        return;
      }
      if (!H(m) && !c) {
        h.current = 0;
        return;
      }
      if (N && !c) {
        b("already refreshing");
        return;
      }
      if (!g) {
        b("no refresh token");
        return;
      }
      const d = h.current;
      if (d > 0 && !c) {
        const s = Math.min(1e3 * Math.pow(2, d), 3e5);
        if (Date.now() - W.current < s)
          return;
      }
      W.current = Date.now(), l(!0);
      try {
        const s = await E();
        s ? (y(s), h.current = 0) : (h.current++, b(`refresh returned empty response (attempt ${h.current})`));
      } catch (s) {
        h.current++, console.error(`[sdk/provider]: Error refreshing token (attempt ${h.current})`, s);
      } finally {
        l(!1);
      }
    },
    [
      f,
      g,
      E,
      y,
      N,
      m,
      l
    ]
  ), te = 1e4 * Math.random();
  we(
    () => {
      $();
    },
    V && g ? 1e4 + te : null,
    [$]
  ), v(() => {
    let c = "";
    if (V && !a) {
      if (O) {
        l(!1);
        const d = new URLSearchParams(window.location.search);
        if (c = d.get("code") ?? "", !c) {
          const s = d.get("error_description") ?? "An unknown error occurred";
          console.error(
            `[sdk/provider]: ${s}
Expected  to find a '?code=' parameter in the URL but found none`
          ), C(s), R();
          return;
        }
        if (_(!1), J.current)
          return;
        J.current = !0, Y((n == null ? void 0 : n.token_endpoint) ?? "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: e,
            redirect_uri: r,
            code: c,
            code_verifier: X,
            grant_type: "authorization_code"
          })
        }).then(y).catch((s) => {
          console.error("[sdk/provider]: error in fetching", s), C("An error occurred while fetching tokens");
        }), window.history.replaceState({}, document.title, window.location.pathname);
      }
      $(!0);
    }
  }, [a]);
  const x = {
    isAuthenticated: !!f && !N,
    accessToken: f,
    user: re ?? null,
    login: B,
    logout: z,
    isReady: !a && !O
  };
  return /* @__PURE__ */ oe(
    G.Provider,
    {
      value: {
        clientId: e,
        redirectUri: r,
        env: o,
        login: B,
        logout: z,
        authInProgress: O,
        authError: ee,
        idToken: Z,
        accessToken: f,
        refreshToken: g,
        user: x.user,
        isAuthenticated: x.isAuthenticated,
        isReady: x.isReady,
        url: u
      },
      children: typeof t == "function" ? t(x) : t
    }
  );
}
const Te = () => {
  const e = ae(G);
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
  Se as DevaProvider,
  Te as useDeva
};
