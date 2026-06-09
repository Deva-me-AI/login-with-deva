import et, { createContext as Kt, useContext as zt, useEffect as ae, useLayoutEffect as ce, useRef as H, useMemo as ue, useCallback as ft, useDebugValue as le } from "react";
const fe = {
  clientId: "",
  redirectUri: "",
  env: "development",
  authInProgress: !1,
  authError: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  idToken: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: !1,
  isReady: !1,
  url: ""
}, de = Kt(null), Je = () => zt(de) ?? fe;
var st = { exports: {} }, dt = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jt;
function Ee() {
  if (jt) return dt;
  jt = 1;
  var t = et;
  function e(u, d) {
    return u === d && (u !== 0 || 1 / u === 1 / d) || u !== u && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : e, o = t.useState, a = t.useEffect, s = t.useLayoutEffect, c = t.useDebugValue;
  function p(u, d) {
    var i = d(), E = o({ inst: { value: i, getSnapshot: d } }), l = E[0].inst, C = E[1];
    return s(
      function() {
        l.value = i, l.getSnapshot = d, h(l) && C({ inst: l });
      },
      [u, i, d]
    ), a(
      function() {
        return h(l) && C({ inst: l }), u(function() {
          h(l) && C({ inst: l });
        });
      },
      [u]
    ), c(i), i;
  }
  function h(u) {
    var d = u.getSnapshot;
    u = u.value;
    try {
      var i = d();
      return !n(u, i);
    } catch {
      return !0;
    }
  }
  function w(u, d) {
    return d();
  }
  var v = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? w : p;
  return dt.useSyncExternalStore = t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : v, dt;
}
var Et = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qt;
function pe() {
  return qt || (qt = 1, process.env.NODE_ENV !== "production" && function() {
    function t(i, E) {
      return i === E && (i !== 0 || 1 / i === 1 / E) || i !== i && E !== E;
    }
    function e(i, E) {
      v || a.startTransition === void 0 || (v = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var l = E();
      if (!u) {
        var C = E();
        s(l, C) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      C = c({
        inst: { value: l, getSnapshot: E }
      });
      var r = C[0].inst, M = C[1];
      return h(
        function() {
          r.value = l, r.getSnapshot = E, n(r) && M({ inst: r });
        },
        [i, l, E]
      ), p(
        function() {
          return n(r) && M({ inst: r }), i(function() {
            n(r) && M({ inst: r });
          });
        },
        [i]
      ), w(l), l;
    }
    function n(i) {
      var E = i.getSnapshot;
      i = i.value;
      try {
        var l = E();
        return !s(i, l);
      } catch {
        return !0;
      }
    }
    function o(i, E) {
      return E();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var a = et, s = typeof Object.is == "function" ? Object.is : t, c = a.useState, p = a.useEffect, h = a.useLayoutEffect, w = a.useDebugValue, v = !1, u = !1, d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? o : e;
    Et.useSyncExternalStore = a.useSyncExternalStore !== void 0 ? a.useSyncExternalStore : d, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Et;
}
var Ht;
function he() {
  return Ht || (Ht = 1, process.env.NODE_ENV === "production" ? st.exports = Ee() : st.exports = pe()), st.exports;
}
var Se = he(), Gt = Object.prototype.hasOwnProperty;
function Ot(t, e) {
  var n, o;
  if (t === e) return !0;
  if (t && e && (n = t.constructor) === e.constructor) {
    if (n === Date) return t.getTime() === e.getTime();
    if (n === RegExp) return t.toString() === e.toString();
    if (n === Array) {
      if ((o = t.length) === e.length)
        for (; o-- && Ot(t[o], e[o]); ) ;
      return o === -1;
    }
    if (!n || typeof t == "object") {
      o = 0;
      for (n in t)
        if (Gt.call(t, n) && ++o && !Gt.call(e, n) || !(n in e) || !Ot(t[n], e[n])) return !1;
      return Object.keys(e).length === o;
    }
  }
  return t !== t && e !== e;
}
const F = /* @__PURE__ */ new WeakMap(), P = () => {
}, D = (
  /*#__NOINLINE__*/
  P()
), mt = Object, f = (t) => t === D, b = (t) => typeof t == "function", j = (t, e) => ({
  ...t,
  ...e
}), Jt = (t) => b(t.then), pt = {}, it = {}, At = "undefined", ct = typeof window != At, Tt = typeof document != At, _e = () => ct && typeof window.requestAnimationFrame != At, Yt = (t, e) => {
  const n = F.get(t);
  return [
    // Getter
    () => !f(e) && t.get(e) || pt,
    // Setter
    (o) => {
      if (!f(e)) {
        const a = t.get(e);
        e in it || (it[e] = a), n[5](e, j(a, o), a || pt);
      }
    },
    // Subscriber
    n[6],
    // Get server cache snapshot
    () => !f(e) && e in it ? it[e] : !f(e) && t.get(e) || pt
  ];
};
let gt = !0;
const ve = () => gt, [wt, yt] = ct && window.addEventListener ? [
  window.addEventListener.bind(window),
  window.removeEventListener.bind(window)
] : [
  P,
  P
], Re = () => {
  const t = Tt && document.visibilityState;
  return f(t) || t !== "hidden";
}, Oe = (t) => (Tt && document.addEventListener("visibilitychange", t), wt("focus", t), () => {
  Tt && document.removeEventListener("visibilitychange", t), yt("focus", t);
}), me = (t) => {
  const e = () => {
    gt = !0, t();
  }, n = () => {
    gt = !1;
  };
  return wt("online", e), wt("offline", n), () => {
    yt("online", e), yt("offline", n);
  };
}, Te = {
  isOnline: ve,
  isVisible: Re
}, ge = {
  initFocus: Oe,
  initReconnect: me
}, kt = !et.useId, tt = !ct || "Deno" in globalThis, we = (t) => _e() ? window.requestAnimationFrame(t) : setTimeout(t, 1), ht = tt ? ae : ce, St = typeof navigator < "u" && navigator.connection, $t = !tt && St && ([
  "slow-2g",
  "2g"
].includes(St.effectiveType) || St.saveData), at = /* @__PURE__ */ new WeakMap(), _t = (t, e) => mt.prototype.toString.call(t) === `[object ${e}]`;
let ye = 0;
const Dt = (t) => {
  const e = typeof t, n = _t(t, "Date"), o = _t(t, "RegExp"), a = _t(t, "Object");
  let s, c;
  if (mt(t) === t && !n && !o) {
    if (s = at.get(t), s) return s;
    if (s = ++ye + "~", at.set(t, s), Array.isArray(t)) {
      for (s = "@", c = 0; c < t.length; c++)
        s += Dt(t[c]) + ",";
      at.set(t, s);
    }
    if (a) {
      s = "#";
      const p = mt.keys(t).sort();
      for (; !f(c = p.pop()); )
        f(t[c]) || (s += c + ":" + Dt(t[c]) + ",");
      at.set(t, s);
    }
  } else
    s = n ? t.toJSON() : e == "symbol" ? t.toString() : e == "string" ? JSON.stringify(t) : "" + t;
  return s;
}, Lt = (t) => {
  if (b(t))
    try {
      t = t();
    } catch {
      t = "";
    }
  const e = t;
  return t = typeof t == "string" ? t : (Array.isArray(t) ? t.length : t) ? Dt(t) : "", [
    t,
    e
  ];
};
let De = 0;
const Ct = () => ++De, Xt = 0, Qt = 1, Zt = 2, Ce = 3;
var Z = {
  __proto__: null,
  ERROR_REVALIDATE_EVENT: Ce,
  FOCUS_EVENT: Xt,
  MUTATE_EVENT: Zt,
  RECONNECT_EVENT: Qt
};
async function te(...t) {
  const [e, n, o, a] = t, s = j({
    populateCache: !0,
    throwOnError: !0
  }, typeof a == "boolean" ? {
    revalidate: a
  } : a || {});
  let c = s.populateCache;
  const p = s.rollbackOnError;
  let h = s.optimisticData;
  const w = (d) => typeof p == "function" ? p(d) : p !== !1, v = s.throwOnError;
  if (b(n)) {
    const d = n, i = [], E = e.keys();
    for (const l of E)
      // Skip the special useSWRInfinite and useSWRSubscription keys.
      !/^\$(inf|sub)\$/.test(l) && d(e.get(l)._k) && i.push(l);
    return Promise.all(i.map(u));
  }
  return u(n);
  async function u(d) {
    const [i] = Lt(d);
    if (!i) return;
    const [E, l] = Yt(e, i), [C, r, M, X] = F.get(e), W = () => {
      const V = C[i];
      return (b(s.revalidate) ? s.revalidate(E().data, d) : s.revalidate !== !1) && (delete M[i], delete X[i], V && V[0]) ? V[0](Zt).then(() => E().data) : E().data;
    };
    if (t.length < 3)
      return W();
    let T = o, A;
    const G = Ct();
    r[i] = [
      G,
      0
    ];
    const O = !f(h), k = E(), I = k.data, $ = k._c, q = f($) ? I : $;
    if (O && (h = b(h) ? h(q, I) : h, l({
      data: h,
      _c: q
    })), b(T))
      try {
        T = T(q);
      } catch (V) {
        A = V;
      }
    if (T && Jt(T))
      if (T = await T.catch((V) => {
        A = V;
      }), G !== r[i][0]) {
        if (A) throw A;
        return T;
      } else A && O && w(A) && (c = !0, l({
        data: q,
        _c: D
      }));
    if (c && !A)
      if (b(c)) {
        const V = c(T, q);
        l({
          data: V,
          error: D,
          _c: D
        });
      } else
        l({
          data: T,
          error: D,
          _c: D
        });
    if (r[i][1] = Ct(), Promise.resolve(W()).then(() => {
      l({
        _c: D
      });
    }), A) {
      if (v) throw A;
      return;
    }
    return T;
  }
}
const Bt = (t, e) => {
  for (const n in t)
    t[n][0] && t[n][0](e);
}, Ae = (t, e) => {
  if (!F.has(t)) {
    const n = j(ge, e), o = {}, a = te.bind(D, t);
    let s = P;
    const c = {}, p = (v, u) => {
      const d = c[v] || [];
      return c[v] = d, d.push(u), () => d.splice(d.indexOf(u), 1);
    }, h = (v, u, d) => {
      t.set(v, u);
      const i = c[v];
      if (i)
        for (const E of i)
          E(u, d);
    }, w = () => {
      if (!F.has(t) && (F.set(t, [
        o,
        {},
        {},
        {},
        a,
        h,
        p
      ]), !tt)) {
        const v = n.initFocus(setTimeout.bind(D, Bt.bind(D, o, Xt))), u = n.initReconnect(setTimeout.bind(D, Bt.bind(D, o, Qt)));
        s = () => {
          v && v(), u && u(), F.delete(t);
        };
      }
    };
    return w(), [
      t,
      a,
      w,
      s
    ];
  }
  return [
    t,
    F.get(t)[4]
  ];
}, Le = (t, e, n, o, a) => {
  const s = n.errorRetryCount, c = a.retryCount, p = ~~((Math.random() + 0.5) * (1 << (c < 8 ? c : 8))) * n.errorRetryInterval;
  !f(s) && c > s || setTimeout(o, p, a);
}, Ve = Ot, [ee, Ie] = Ae(/* @__PURE__ */ new Map()), Ne = j(
  {
    // events
    onLoadingSlow: P,
    onSuccess: P,
    onError: P,
    onErrorRetry: Le,
    onDiscarded: P,
    // switches
    revalidateOnFocus: !0,
    revalidateOnReconnect: !0,
    revalidateIfStale: !0,
    shouldRetryOnError: !0,
    // timeouts
    errorRetryInterval: $t ? 1e4 : 5e3,
    focusThrottleInterval: 5 * 1e3,
    dedupingInterval: 2 * 1e3,
    loadingTimeout: $t ? 5e3 : 3e3,
    // providers
    compare: Ve,
    isPaused: () => !1,
    cache: ee,
    mutate: Ie,
    fallback: {}
  },
  // use web preset by default
  Te
), be = (t, e) => {
  const n = j(t, e);
  if (e) {
    const { use: o, fallback: a } = t, { use: s, fallback: c } = e;
    o && s && (n.use = o.concat(s)), a && c && (n.fallback = j(a, c));
  }
  return n;
}, xe = Kt({}), Ue = "$inf$", ne = ct && window.__SWR_DEVTOOLS_USE__, Fe = ne ? window.__SWR_DEVTOOLS_USE__ : [], Me = () => {
  ne && (window.__SWR_DEVTOOLS_REACT__ = et);
}, We = (t) => b(t[1]) ? [
  t[0],
  t[1],
  t[2] || {}
] : [
  t[0],
  null,
  (t[1] === null ? t[2] : t[1]) || {}
], Pe = () => j(Ne, zt(xe)), je = (t) => (e, n, o) => t(e, n && ((...s) => {
  const [c] = Lt(e), [, , , p] = F.get(ee);
  if (c.startsWith(Ue))
    return n(...s);
  const h = p[c];
  return f(h) ? n(...s) : (delete p[c], h);
}), o), qe = Fe.concat(je), He = (t) => function(...n) {
  const o = Pe(), [a, s, c] = We(n), p = be(o, c);
  let h = t;
  const { use: w } = p, v = (w || []).concat(qe);
  for (let u = v.length; u--; )
    h = v[u](h);
  return h(a, s || p.fetcher || null, p);
}, Ge = (t, e, n) => {
  const o = e[t] || (e[t] = []);
  return o.push(n), () => {
    const a = o.indexOf(n);
    a >= 0 && (o[a] = o[o.length - 1], o.pop());
  };
};
Me();
const vt = et.use || // This extra generic is to avoid TypeScript mixing up the generic and JSX sytax
// and emitting an error.
// We assume that this is only for the `use(thenable)` case, not `use(context)`.
// https://github.com/facebook/react/blob/aed00dacfb79d17c53218404c52b1c7aa59c4a89/packages/react-server/src/ReactFizzThenable.js#L45
((t) => {
  switch (t.status) {
    case "pending":
      throw t;
    case "fulfilled":
      return t.value;
    case "rejected":
      throw t.reason;
    default:
      throw t.status = "pending", t.then((e) => {
        t.status = "fulfilled", t.value = e;
      }, (e) => {
        t.status = "rejected", t.reason = e;
      }), t;
  }
}), Rt = {
  dedupe: !0
}, ke = (t, e, n) => {
  const { cache: o, compare: a, suspense: s, fallbackData: c, revalidateOnMount: p, revalidateIfStale: h, refreshInterval: w, refreshWhenHidden: v, refreshWhenOffline: u, keepPreviousData: d } = n, [i, E, l, C] = F.get(o), [r, M] = Lt(t), X = H(!1), W = H(!1), T = H(r), A = H(e), G = H(n), O = () => G.current, k = () => O().isVisible() && O().isOnline(), [I, $, q, V] = Yt(o, r), B = H({}).current, nt = f(c) ? f(n.fallback) ? D : n.fallback[r] : c, Vt = (S, _) => {
    for (const g in B) {
      const R = g;
      if (R === "data") {
        if (!a(S[R], _[R]) && (!f(S[R]) || !a(ot, _[R])))
          return !1;
      } else if (_[R] !== S[R])
        return !1;
    }
    return !0;
  }, It = ue(() => {
    const S = !r || !e ? !1 : f(p) ? O().isPaused() || s ? !1 : h !== !1 : p, _ = (y) => {
      const x = j(y);
      return delete x._k, S ? {
        isValidating: !0,
        isLoading: !0,
        ...x
      } : x;
    }, g = I(), R = V(), N = _(g), Y = g === R ? N : _(R);
    let m = N;
    return [
      () => {
        const y = _(I());
        return Vt(y, m) ? (m.data = y.data, m.isLoading = y.isLoading, m.isValidating = y.isValidating, m.error = y.error, m) : (m = y, y);
      },
      () => Y
    ];
  }, [
    o,
    r
  ]), K = Se.useSyncExternalStore(ft(
    (S) => q(r, (_, g) => {
      Vt(g, _) || S();
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      o,
      r
    ]
  ), It[0], It[1]), Nt = !X.current, re = i[r] && i[r].length > 0, z = K.data, J = f(z) ? nt && Jt(nt) ? vt(nt) : nt : z, rt = K.error, bt = H(J), ot = d ? f(z) ? bt.current : z : J, xt = re && !f(rt) ? !1 : Nt && !f(p) ? p : O().isPaused() ? !1 : s ? f(J) ? !1 : h : f(J) || h, Ut = !!(r && e && Nt && xt), oe = f(K.isValidating) ? Ut : K.isValidating, se = f(K.isLoading) ? Ut : K.isLoading, Q = ft(
    async (S) => {
      const _ = A.current;
      if (!r || !_ || W.current || O().isPaused())
        return !1;
      let g, R, N = !0;
      const Y = S || {}, m = !l[r] || !Y.dedupe, y = () => kt ? !W.current && r === T.current && X.current : r === T.current, x = {
        isValidating: !1,
        isLoading: !1
      }, Mt = () => {
        $(x);
      }, Wt = () => {
        const L = l[r];
        L && L[1] === R && delete l[r];
      }, Pt = {
        isValidating: !0
      };
      f(I().data) && (Pt.isLoading = !0);
      try {
        if (m && ($(Pt), n.loadingTimeout && f(I().data) && setTimeout(() => {
          N && y() && O().onLoadingSlow(r, n);
        }, n.loadingTimeout), l[r] = [
          _(M),
          Ct()
        ]), [g, R] = l[r], g = await g, m && setTimeout(Wt, n.dedupingInterval), !l[r] || l[r][1] !== R)
          return m && y() && O().onDiscarded(r), !1;
        x.error = D;
        const L = E[r];
        if (!f(L) && // case 1
        (R <= L[0] || // case 2
        R <= L[1] || // case 3
        L[1] === 0))
          return Mt(), m && y() && O().onDiscarded(r), !1;
        const U = I().data;
        x.data = a(U, g) ? U : g, m && y() && O().onSuccess(g, r, n);
      } catch (L) {
        Wt();
        const U = O(), { shouldRetryOnError: ut } = U;
        U.isPaused() || (x.error = L, m && y() && (U.onError(L, r, U), (ut === !0 || b(ut) && ut(L)) && (!O().revalidateOnFocus || !O().revalidateOnReconnect || k()) && U.onErrorRetry(L, r, U, (ie) => {
          const lt = i[r];
          lt && lt[0] && lt[0](Z.ERROR_REVALIDATE_EVENT, ie);
        }, {
          retryCount: (Y.retryCount || 0) + 1,
          dedupe: !0
        })));
      }
      return N = !1, Mt(), !0;
    },
    // `setState` is immutable, and `eventsCallback`, `fnArg`, and
    // `keyValidating` are depending on `key`, so we can exclude them from
    // the deps array.
    //
    // FIXME:
    // `fn` and `config` might be changed during the lifecycle,
    // but they might be changed every render like this.
    // `useSWR('key', () => fetch('/api/'), { suspense: true })`
    // So we omit the values from the deps array
    // even though it might cause unexpected behaviors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      r,
      o
    ]
  ), Ft = ft(
    // Use callback to make sure `keyRef.current` returns latest result every time
    (...S) => te(o, T.current, ...S),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (ht(() => {
    A.current = e, G.current = n, f(z) || (bt.current = z);
  }), ht(() => {
    if (!r) return;
    const S = Q.bind(D, Rt);
    let _ = 0;
    const R = Ge(r, i, (N, Y = {}) => {
      if (N == Z.FOCUS_EVENT) {
        const m = Date.now();
        O().revalidateOnFocus && m > _ && k() && (_ = m + O().focusThrottleInterval, S());
      } else if (N == Z.RECONNECT_EVENT)
        O().revalidateOnReconnect && k() && S();
      else {
        if (N == Z.MUTATE_EVENT)
          return Q();
        if (N == Z.ERROR_REVALIDATE_EVENT)
          return Q(Y);
      }
    });
    return W.current = !1, T.current = r, X.current = !0, $({
      _k: M
    }), xt && (f(J) || tt ? S() : we(S)), () => {
      W.current = !0, R();
    };
  }, [
    r
  ]), ht(() => {
    let S;
    function _() {
      const R = b(w) ? w(I().data) : w;
      R && S !== -1 && (S = setTimeout(g, R));
    }
    function g() {
      !I().error && (v || O().isVisible()) && (u || O().isOnline()) ? Q(Rt).then(_) : _();
    }
    return _(), () => {
      S && (clearTimeout(S), S = -1);
    };
  }, [
    w,
    v,
    u,
    r
  ]), le(ot), s && f(J) && r) {
    if (!kt && tt)
      throw new Error("Fallback data is required when using Suspense in SSR.");
    A.current = e, G.current = n, W.current = !1;
    const S = C[r];
    if (!f(S)) {
      const _ = Ft(S);
      vt(_);
    }
    if (f(rt)) {
      const _ = Q(Rt);
      f(ot) || (_.status = "fulfilled", _.value = !0), vt(_);
    } else
      throw rt;
  }
  return {
    mutate: Ft,
    get data() {
      return B.data = !0, ot;
    },
    get error() {
      return B.error = !0, rt;
    },
    get isValidating() {
      return B.isValidating = !0, oe;
    },
    get isLoading() {
      return B.isLoading = !0, se;
    }
  };
}, $e = He(ke), Be = (...t) => fetch(...t).then((e) => {
  if (!e.ok)
    throw new Error(e.statusText);
  return e.json();
}), Ye = (t, e, n) => $e(
  t,
  async (o) => Be(o, e),
  n
), Ke = (t) => {
  switch (t) {
    case "development":
      return "http://localhost:3000";
    case "staging":
      return "https://staging.deva.me";
    case "production":
      return "https://www.deva.me";
  }
}, Xe = (t, e) => e ?? Ke(t);
export {
  de as D,
  Je as a,
  Ke as e,
  Be as f,
  Xe as r,
  Ye as u
};
