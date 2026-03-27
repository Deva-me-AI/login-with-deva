import oe, { createContext as Qe, useContext as Ze, useEffect as Et, useLayoutEffect as pt, useMemo as et, useRef as M, useCallback as Se, useDebugValue as St } from "react";
const vt = {
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
}, _t = Qe(null), nn = () => Ze(_t) ?? vt;
var ue = { exports: {} }, ve = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var He;
function mt() {
  if (He) return ve;
  He = 1;
  var e = oe;
  function t(c, h) {
    return c === h && (c !== 0 || 1 / c === 1 / h) || c !== c && h !== h;
  }
  var n = typeof Object.is == "function" ? Object.is : t, r = e.useState, a = e.useEffect, l = e.useLayoutEffect, s = e.useDebugValue;
  function f(c, h) {
    var i = h(), d = r({ inst: { value: i, getSnapshot: h } }), E = d[0].inst, R = d[1];
    return l(
      function() {
        E.value = i, E.getSnapshot = h, p(E) && R({ inst: E });
      },
      [c, i, h]
    ), a(
      function() {
        return p(E) && R({ inst: E }), c(function() {
          p(E) && R({ inst: E });
        });
      },
      [c]
    ), s(i), i;
  }
  function p(c) {
    var h = c.getSnapshot;
    c = c.value;
    try {
      var i = h();
      return !n(c, i);
    } catch {
      return !0;
    }
  }
  function D(c, h) {
    return h();
  }
  var _ = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? D : f;
  return ve.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : _, ve;
}
var _e = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ke;
function gt() {
  return ke || (ke = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(i, d) {
      return i === d && (i !== 0 || 1 / i === 1 / d) || i !== i && d !== d;
    }
    function t(i, d) {
      _ || a.startTransition === void 0 || (_ = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var E = d();
      if (!c) {
        var R = d();
        l(E, R) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), c = !0);
      }
      R = s({
        inst: { value: E, getSnapshot: d }
      });
      var C = R[0].inst, o = R[1];
      return p(
        function() {
          C.value = E, C.getSnapshot = d, n(C) && o({ inst: C });
        },
        [i, E, d]
      ), f(
        function() {
          return n(C) && o({ inst: C }), i(function() {
            n(C) && o({ inst: C });
          });
        },
        [i]
      ), D(E), E;
    }
    function n(i) {
      var d = i.getSnapshot;
      i = i.value;
      try {
        var E = d();
        return !l(i, E);
      } catch {
        return !0;
      }
    }
    function r(i, d) {
      return d();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var a = oe, l = typeof Object.is == "function" ? Object.is : e, s = a.useState, f = a.useEffect, p = a.useLayoutEffect, D = a.useDebugValue, _ = !1, c = !1, h = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? r : t;
    _e.useSyncExternalStore = a.useSyncExternalStore !== void 0 ? a.useSyncExternalStore : h, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), _e;
}
var Ge;
function Ot() {
  return Ge || (Ge = 1, process.env.NODE_ENV === "production" ? ue.exports = mt() : ue.exports = gt()), ue.exports;
}
var $e = Ot();
const tt = 0, nt = 1, rt = 2, Be = 3;
var Ke = Object.prototype.hasOwnProperty;
function Te(e, t) {
  var n, r;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((r = e.length) === t.length)
        for (; r-- && Te(e[r], t[r]); ) ;
      return r === -1;
    }
    if (!n || typeof e == "object") {
      r = 0;
      for (n in e)
        if (Ke.call(e, n) && ++r && !Ke.call(t, n) || !(n in t) || !Te(e[n], t[n])) return !1;
      return Object.keys(t).length === r;
    }
  }
  return e !== e && t !== t;
}
const j = /* @__PURE__ */ new WeakMap(), U = () => {
}, T = (
  /*#__NOINLINE__*/
  U()
), De = Object, u = (e) => e === T, F = (e) => typeof e == "function", q = (e, t) => ({
  ...e,
  ...t
}), ot = (e) => F(e.then), me = {}, le = {}, xe = "undefined", se = typeof window != xe, Ce = typeof document != xe, Rt = se && "Deno" in window, wt = () => se && typeof window.requestAnimationFrame != xe, st = (e, t) => {
  const n = j.get(e);
  return [
    // Getter
    () => !u(t) && e.get(t) || me,
    // Setter
    (r) => {
      if (!u(t)) {
        const a = e.get(t);
        t in le || (le[t] = a), n[5](t, q(a, r), a || me);
      }
    },
    // Subscriber
    n[6],
    // Get server cache snapshot
    () => !u(t) && t in le ? le[t] : !u(t) && e.get(t) || me
  ];
};
let Le = !0;
const yt = () => Le, [Ae, Ie] = se && window.addEventListener ? [
  window.addEventListener.bind(window),
  window.removeEventListener.bind(window)
] : [
  U,
  U
], Tt = () => {
  const e = Ce && document.visibilityState;
  return u(e) || e !== "hidden";
}, Dt = (e) => (Ce && document.addEventListener("visibilitychange", e), Ae("focus", e), () => {
  Ce && document.removeEventListener("visibilitychange", e), Ie("focus", e);
}), Ct = (e) => {
  const t = () => {
    Le = !0, e();
  }, n = () => {
    Le = !1;
  };
  return Ae("online", t), Ae("offline", n), () => {
    Ie("online", t), Ie("offline", n);
  };
}, Lt = {
  isOnline: yt,
  isVisible: Tt
}, At = {
  initFocus: Dt,
  initReconnect: Ct
}, ze = !oe.useId, Z = !se || Rt, It = (e) => wt() ? window.requestAnimationFrame(e) : setTimeout(e, 1), ge = Z ? Et : pt, Oe = typeof navigator < "u" && navigator.connection, Ye = !Z && Oe && ([
  "slow-2g",
  "2g"
].includes(Oe.effectiveType) || Oe.saveData), fe = /* @__PURE__ */ new WeakMap(), bt = (e) => De.prototype.toString.call(e), Re = (e, t) => e === `[object ${t}]`;
let Vt = 0;
const be = (e) => {
  const t = typeof e, n = bt(e), r = Re(n, "Date"), a = Re(n, "RegExp"), l = Re(n, "Object");
  let s, f;
  if (De(e) === e && !r && !a) {
    if (s = fe.get(e), s) return s;
    if (s = ++Vt + "~", fe.set(e, s), Array.isArray(e)) {
      for (s = "@", f = 0; f < e.length; f++)
        s += be(e[f]) + ",";
      fe.set(e, s);
    }
    if (l) {
      s = "#";
      const p = De.keys(e).sort();
      for (; !u(f = p.pop()); )
        u(e[f]) || (s += f + ":" + be(e[f]) + ",");
      fe.set(e, s);
    }
  } else
    s = r ? e.toJSON() : t == "symbol" ? e.toString() : t == "string" ? JSON.stringify(e) : "" + e;
  return s;
}, Ne = (e) => {
  if (F(e))
    try {
      e = e();
    } catch {
      e = "";
    }
  const t = e;
  return e = typeof e == "string" ? e : (Array.isArray(e) ? e.length : e) ? be(e) : "", [
    e,
    t
  ];
};
let xt = 0;
const Ve = () => ++xt;
async function it(...e) {
  const [t, n, r, a] = e, l = q({
    populateCache: !0,
    throwOnError: !0
  }, typeof a == "boolean" ? {
    revalidate: a
  } : a || {});
  let s = l.populateCache;
  const f = l.rollbackOnError;
  let p = l.optimisticData;
  const D = (h) => typeof f == "function" ? f(h) : f !== !1, _ = l.throwOnError;
  if (F(n)) {
    const h = n, i = [], d = t.keys();
    for (const E of d)
      // Skip the special useSWRInfinite and useSWRSubscription keys.
      !/^\$(inf|sub)\$/.test(E) && h(t.get(E)._k) && i.push(E);
    return Promise.all(i.map(c));
  }
  return c(n);
  async function c(h) {
    const [i] = Ne(h);
    if (!i) return;
    const [d, E] = st(t, i), [R, C, o, ie] = j.get(t), $ = () => {
      const I = R[i];
      return (F(l.revalidate) ? l.revalidate(d().data, h) : l.revalidate !== !1) && (delete o[i], delete ie[i], I && I[0]) ? I[0](rt).then(() => d().data) : d().data;
    };
    if (e.length < 3)
      return $();
    let y = r, V, x = !1;
    const B = Ve();
    C[i] = [
      B,
      0
    ];
    const v = !u(p), K = d(), N = K.data, z = K._c, H = u(z) ? N : z;
    if (v && (p = F(p) ? p(H, N) : p, E({
      data: p,
      _c: H
    })), F(y))
      try {
        y = y(H);
      } catch (I) {
        V = I, x = !0;
      }
    if (y && ot(y))
      if (y = await y.catch((I) => {
        V = I, x = !0;
      }), B !== C[i][0]) {
        if (x) throw V;
        return y;
      } else x && v && D(V) && (s = !0, E({
        data: H,
        _c: T
      }));
    if (s && !x)
      if (F(s)) {
        const I = s(y, H);
        E({
          data: I,
          error: T,
          _c: T
        });
      } else
        E({
          data: y,
          error: T,
          _c: T
        });
    if (C[i][1] = Ve(), Promise.resolve($()).then(() => {
      E({
        _c: T
      });
    }), x) {
      if (_) throw V;
      return;
    }
    return y;
  }
}
const Je = (e, t) => {
  for (const n in e)
    e[n][0] && e[n][0](t);
}, Nt = (e, t) => {
  if (!j.has(e)) {
    const n = q(At, t), r = /* @__PURE__ */ Object.create(null), a = it.bind(T, e);
    let l = U;
    const s = /* @__PURE__ */ Object.create(null), f = (_, c) => {
      const h = s[_] || [];
      return s[_] = h, h.push(c), () => h.splice(h.indexOf(c), 1);
    }, p = (_, c, h) => {
      e.set(_, c);
      const i = s[_];
      if (i)
        for (const d of i)
          d(c, h);
    }, D = () => {
      if (!j.has(e) && (j.set(e, [
        r,
        /* @__PURE__ */ Object.create(null),
        /* @__PURE__ */ Object.create(null),
        /* @__PURE__ */ Object.create(null),
        a,
        p,
        f
      ]), !Z)) {
        const _ = n.initFocus(setTimeout.bind(T, Je.bind(T, r, tt))), c = n.initReconnect(setTimeout.bind(T, Je.bind(T, r, nt)));
        l = () => {
          _ && _(), c && c(), j.delete(e);
        };
      }
    };
    return D(), [
      e,
      a,
      D,
      l
    ];
  }
  return [
    e,
    j.get(e)[4]
  ];
}, Wt = (e, t, n, r, a) => {
  const l = n.errorRetryCount, s = a.retryCount, f = ~~((Math.random() + 0.5) * (1 << (s < 8 ? s : 8))) * n.errorRetryInterval;
  !u(l) && s > l || setTimeout(r, f, a);
}, Ft = Te, [at, Pt] = Nt(/* @__PURE__ */ new Map()), jt = q(
  {
    // events
    onLoadingSlow: U,
    onSuccess: U,
    onError: U,
    onErrorRetry: Wt,
    onDiscarded: U,
    // switches
    revalidateOnFocus: !0,
    revalidateOnReconnect: !0,
    revalidateIfStale: !0,
    shouldRetryOnError: !0,
    // timeouts
    errorRetryInterval: Ye ? 1e4 : 5e3,
    focusThrottleInterval: 5 * 1e3,
    dedupingInterval: 2 * 1e3,
    loadingTimeout: Ye ? 5e3 : 3e3,
    // providers
    compare: Ft,
    isPaused: () => !1,
    cache: at,
    mutate: Pt,
    fallback: {}
  },
  // use web preset by default
  Lt
), Ut = (e, t) => {
  const n = q(e, t);
  if (t) {
    const { use: r, fallback: a } = e, { use: l, fallback: s } = t;
    r && l && (n.use = r.concat(l)), a && s && (n.fallback = q(a, s));
  }
  return n;
}, Mt = Qe({}), qt = "$inf$", ct = se && window.__SWR_DEVTOOLS_USE__, Ht = ct ? window.__SWR_DEVTOOLS_USE__ : [], kt = () => {
  ct && (window.__SWR_DEVTOOLS_REACT__ = oe);
}, Gt = (e) => F(e[1]) ? [
  e[0],
  e[1],
  e[2] || {}
] : [
  e[0],
  null,
  (e[1] === null ? e[2] : e[1]) || {}
], $t = () => {
  const e = Ze(Mt);
  return et(() => q(jt, e), [
    e
  ]);
}, Bt = (e) => (t, n, r) => e(t, n && ((...l) => {
  const [s] = Ne(t), [, , , f] = j.get(at);
  if (s.startsWith(qt))
    return n(...l);
  const p = f[s];
  return u(p) ? n(...l) : (delete f[s], p);
}), r), Kt = Ht.concat(Bt), zt = (e) => function(...n) {
  const r = $t(), [a, l, s] = Gt(n), f = Ut(r, s);
  let p = e;
  const { use: D } = f, _ = (D || []).concat(Kt);
  for (let c = _.length; c--; )
    p = _[c](p);
  return p(a, l || f.fetcher || null, f);
}, Yt = (e, t, n) => {
  const r = t[e] || (t[e] = []);
  return r.push(n), () => {
    const a = r.indexOf(n);
    a >= 0 && (r[a] = r[r.length - 1], r.pop());
  };
};
kt();
const we = oe.use || // This extra generic is to avoid TypeScript mixing up the generic and JSX sytax
// and emitting an error.
// We assume that this is only for the `use(thenable)` case, not `use(context)`.
// https://github.com/facebook/react/blob/aed00dacfb79d17c53218404c52b1c7aa59c4a89/packages/react-server/src/ReactFizzThenable.js#L45
((e) => {
  switch (e.status) {
    case "pending":
      throw e;
    case "fulfilled":
      return e.value;
    case "rejected":
      throw e.reason;
    default:
      throw e.status = "pending", e.then((t) => {
        e.status = "fulfilled", e.value = t;
      }, (t) => {
        e.status = "rejected", e.reason = t;
      }), e;
  }
}), ye = {
  dedupe: !0
}, Xe = Promise.resolve(T), Jt = () => U, Xt = (e, t, n) => {
  const { cache: r, compare: a, suspense: l, fallbackData: s, revalidateOnMount: f, revalidateIfStale: p, refreshInterval: D, refreshWhenHidden: _, refreshWhenOffline: c, keepPreviousData: h, strictServerPrefetchWarning: i } = n, [d, E, R, C] = j.get(r), [o, ie] = Ne(e), $ = M(!1), y = M(!1), V = M(o), x = M(t), B = M(n), v = () => B.current, K = () => v().isVisible() && v().isOnline(), [N, z, H, I] = st(r, o), Y = M({}).current, J = u(s) ? u(n.fallback) ? T : n.fallback[o] : s, We = (S, m) => {
    for (const g in Y) {
      const O = g;
      if (O === "data") {
        if (!a(S[O], m[O]) && (!u(S[O]) || !a(ce, m[O])))
          return !1;
      } else if (m[O] !== S[O])
        return !1;
    }
    return !0;
  }, de = !$.current, Fe = et(() => {
    const S = N(), m = I(), g = (w) => {
      const b = q(w);
      return delete b._k, (() => {
        if (!o || !t || v().isPaused()) return !1;
        if (de && !u(f)) return f;
        const re = u(J) ? b.data : J;
        return u(re) || p;
      })() ? {
        isValidating: !0,
        isLoading: !0,
        ...b
      } : b;
    }, O = g(S), W = S === m ? O : g(m);
    let L = O;
    return [
      () => {
        const w = g(N());
        return We(w, L) ? (L.data = w.data, L.isLoading = w.isLoading, L.isValidating = w.isValidating, L.error = w.error, L) : (L = w, w);
      },
      () => W
    ];
  }, [
    r,
    o
  ]), X = $e.useSyncExternalStore(Se(
    (S) => H(o, (m, g) => {
      We(g, m) || S();
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      r,
      o
    ]
  ), Fe[0], Fe[1]), ut = d[o] && d[o].length > 0, Q = X.data, k = u(Q) ? J && ot(J) ? we(J) : J : Q, ae = X.error, he = M(k), ce = h ? u(Q) ? u(he.current) ? k : he.current : Q : k, G = o && u(k), ee = M(null);
  !Z && // getServerSnapshot is only called during hydration
  // eslint-disable-next-line react-hooks/rules-of-hooks
  $e.useSyncExternalStore(Jt, () => (ee.current = !1, ee), () => (ee.current = !0, ee));
  const lt = ee.current;
  i && lt && !l && G && console.warn(`Missing pre-initiated data for serialized key "${o}" during server-side rendering. Data fetching should be initiated on the server and provided to SWR via fallback data. You can set "strictServerPrefetchWarning: false" to disable this warning.`);
  const Pe = !o || !t || v().isPaused() || ut && !u(ae) ? !1 : de && !u(f) ? f : l ? u(k) ? !1 : p : u(k) || p, je = de && Pe, ft = u(X.isValidating) ? je : X.isValidating, dt = u(X.isLoading) ? je : X.isLoading, te = Se(
    async (S) => {
      const m = x.current;
      if (!o || !m || y.current || v().isPaused())
        return !1;
      let g, O, W = !0;
      const L = S || {}, w = !R[o] || !L.dedupe, b = () => ze ? !y.current && o === V.current && $.current : o === V.current, ne = {
        isValidating: !1,
        isLoading: !1
      }, re = () => {
        z(ne);
      }, Me = () => {
        const A = R[o];
        A && A[1] === O && delete R[o];
      }, qe = {
        isValidating: !0
      };
      u(N().data) && (qe.isLoading = !0);
      try {
        if (w && (z(qe), n.loadingTimeout && u(N().data) && setTimeout(() => {
          W && b() && v().onLoadingSlow(o, n);
        }, n.loadingTimeout), R[o] = [
          m(ie),
          Ve()
        ]), [g, O] = R[o], g = await g, w && setTimeout(Me, n.dedupingInterval), !R[o] || R[o][1] !== O)
          return w && b() && v().onDiscarded(o), !1;
        ne.error = T;
        const A = E[o];
        if (!u(A) && // case 1
        (O <= A[0] || // case 2
        O <= A[1] || // case 3
        A[1] === 0))
          return re(), w && b() && v().onDiscarded(o), !1;
        const P = N().data;
        ne.data = a(P, g) ? P : g, w && b() && v().onSuccess(g, o, n);
      } catch (A) {
        Me();
        const P = v(), { shouldRetryOnError: Ee } = P;
        P.isPaused() || (ne.error = A, w && b() && (P.onError(A, o, P), (Ee === !0 || F(Ee) && Ee(A)) && (!v().revalidateOnFocus || !v().revalidateOnReconnect || K()) && P.onErrorRetry(A, o, P, (ht) => {
          const pe = d[o];
          pe && pe[0] && pe[0](Be, ht);
        }, {
          retryCount: (L.retryCount || 0) + 1,
          dedupe: !0
        })));
      }
      return W = !1, re(), !0;
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
      o,
      r
    ]
  ), Ue = Se(
    // Use callback to make sure `keyRef.current` returns latest result every time
    (...S) => it(r, V.current, ...S),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (ge(() => {
    x.current = t, B.current = n, u(Q) || (he.current = Q);
  }), ge(() => {
    if (!o) return;
    const S = te.bind(T, ye);
    let m = 0;
    v().revalidateOnFocus && (m = Date.now() + v().focusThrottleInterval);
    const O = Yt(o, d, (W, L = {}) => {
      if (W == tt) {
        const w = Date.now();
        v().revalidateOnFocus && w > m && K() && (m = w + v().focusThrottleInterval, S());
      } else if (W == nt)
        v().revalidateOnReconnect && K() && S();
      else {
        if (W == rt)
          return te();
        if (W == Be)
          return te(L);
      }
    });
    return y.current = !1, V.current = o, $.current = !0, z({
      _k: ie
    }), Pe && (R[o] || (u(k) || Z ? S() : It(S))), () => {
      y.current = !0, O();
    };
  }, [
    o
  ]), ge(() => {
    let S;
    function m() {
      const O = F(D) ? D(N().data) : D;
      O && S !== -1 && (S = setTimeout(g, O));
    }
    function g() {
      !N().error && (_ || v().isVisible()) && (c || v().isOnline()) ? te(ye).then(m) : m();
    }
    return m(), () => {
      S && (clearTimeout(S), S = -1);
    };
  }, [
    D,
    _,
    c,
    o
  ]), St(ce), l) {
    if (!ze && Z && G)
      throw new Error("Fallback data is required when using Suspense in SSR.");
    G && (x.current = t, B.current = n, y.current = !1);
    const S = C[o], m = !u(S) && G ? Ue(S) : Xe;
    if (we(m), !u(ae) && G)
      throw ae;
    const g = G ? te(ye) : Xe;
    !u(ce) && G && (g.status = "fulfilled", g.value = !0), we(g);
  }
  return {
    mutate: Ue,
    get data() {
      return Y.data = !0, ce;
    },
    get error() {
      return Y.error = !0, ae;
    },
    get isValidating() {
      return Y.isValidating = !0, ft;
    },
    get isLoading() {
      return Y.isLoading = !0, dt;
    }
  };
}, Qt = zt(Xt), Zt = (...e) => fetch(...e).then((t) => {
  if (!t.ok)
    throw new Error(t.statusText);
  return t.json();
}), rn = (e, t) => Qt(e, async (n) => Zt(n, t)), on = (e) => {
  switch (e) {
    case "development":
      return "http://localhost:3000";
    case "staging":
      return "https://staging.deva.me";
    case "production":
      return "https://www.deva.me";
  }
};
export {
  _t as D,
  nn as a,
  on as e,
  Zt as f,
  $e as s,
  rn as u
};
