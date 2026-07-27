import te, { createContext as ke, useContext as ze, useEffect as at, useLayoutEffect as ct, useRef as H, useMemo as ut, useCallback as fe, useDebugValue as lt } from "react";
const ft = {
  clientId: "",
  redirectUri: "",
  env: "development",
  authInProgress: !1,
  authError: null,
  login: () => Promise.resolve(),
  trySilentLogin: () => Promise.resolve({ status: "unsupported" }),
  logout: () => Promise.resolve(),
  idToken: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: !1,
  isReady: !1,
  url: ""
}, dt = ke(null), Yt = () => ze(dt) ?? ft;
var oe = { exports: {} }, de = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var je;
function Et() {
  if (je) return de;
  je = 1;
  var e = te;
  function t(u, d) {
    return u === d && (u !== 0 || 1 / u === 1 / d) || u !== u && d !== d;
  }
  var n = typeof Object.is == "function" ? Object.is : t, s = e.useState, a = e.useEffect, o = e.useLayoutEffect, c = e.useDebugValue;
  function p(u, d) {
    var i = d(), E = s({ inst: { value: i, getSnapshot: d } }), l = E[0].inst, A = E[1];
    return o(
      function() {
        l.value = i, l.getSnapshot = d, h(l) && A({ inst: l });
      },
      [u, i, d]
    ), a(
      function() {
        return h(l) && A({ inst: l }), u(function() {
          h(l) && A({ inst: l });
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
  return de.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : v, de;
}
var Ee = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qe;
function pt() {
  return qe || (qe = 1, process.env.NODE_ENV !== "production" && function() {
    function e(i, E) {
      return i === E && (i !== 0 || 1 / i === 1 / E) || i !== i && E !== E;
    }
    function t(i, E) {
      v || a.startTransition === void 0 || (v = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var l = E();
      if (!u) {
        var A = E();
        o(l, A) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), u = !0);
      }
      A = c({
        inst: { value: l, getSnapshot: E }
      });
      var r = A[0].inst, W = A[1];
      return h(
        function() {
          r.value = l, r.getSnapshot = E, n(r) && W({ inst: r });
        },
        [i, l, E]
      ), p(
        function() {
          return n(r) && W({ inst: r }), i(function() {
            n(r) && W({ inst: r });
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
        return !o(i, l);
      } catch {
        return !0;
      }
    }
    function s(i, E) {
      return E();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var a = te, o = typeof Object.is == "function" ? Object.is : e, c = a.useState, p = a.useEffect, h = a.useLayoutEffect, w = a.useDebugValue, v = !1, u = !1, d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? s : t;
    Ee.useSyncExternalStore = a.useSyncExternalStore !== void 0 ? a.useSyncExternalStore : d, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Ee;
}
var He;
function ht() {
  return He || (He = 1, process.env.NODE_ENV === "production" ? oe.exports = Et() : oe.exports = pt()), oe.exports;
}
var St = ht(), Ge = Object.prototype.hasOwnProperty;
function me(e, t) {
  var n, s;
  if (e === t) return !0;
  if (e && t && (n = e.constructor) === t.constructor) {
    if (n === Date) return e.getTime() === t.getTime();
    if (n === RegExp) return e.toString() === t.toString();
    if (n === Array) {
      if ((s = e.length) === t.length)
        for (; s-- && me(e[s], t[s]); ) ;
      return s === -1;
    }
    if (!n || typeof e == "object") {
      s = 0;
      for (n in e)
        if (Ge.call(e, n) && ++s && !Ge.call(t, n) || !(n in t) || !me(e[n], t[n])) return !1;
      return Object.keys(t).length === s;
    }
  }
  return e !== e && t !== t;
}
const F = /* @__PURE__ */ new WeakMap(), P = () => {
}, D = (
  /*#__NOINLINE__*/
  P()
), Oe = Object, f = (e) => e === D, N = (e) => typeof e == "function", j = (e, t) => ({
  ...e,
  ...t
}), Je = (e) => N(e.then), pe = {}, ie = {}, Ce = "undefined", ce = typeof window != Ce, Te = typeof document != Ce, _t = () => ce && typeof window.requestAnimationFrame != Ce, Ye = (e, t) => {
  const n = F.get(e);
  return [
    // Getter
    () => !f(t) && e.get(t) || pe,
    // Setter
    (s) => {
      if (!f(t)) {
        const a = e.get(t);
        t in ie || (ie[t] = a), n[5](t, j(a, s), a || pe);
      }
    },
    // Subscriber
    n[6],
    // Get server cache snapshot
    () => !f(t) && t in ie ? ie[t] : !f(t) && e.get(t) || pe
  ];
};
let ge = !0;
const vt = () => ge, [we, ye] = ce && window.addEventListener ? [
  window.addEventListener.bind(window),
  window.removeEventListener.bind(window)
] : [
  P,
  P
], Rt = () => {
  const e = Te && document.visibilityState;
  return f(e) || e !== "hidden";
}, mt = (e) => (Te && document.addEventListener("visibilitychange", e), we("focus", e), () => {
  Te && document.removeEventListener("visibilitychange", e), ye("focus", e);
}), Ot = (e) => {
  const t = () => {
    ge = !0, e();
  }, n = () => {
    ge = !1;
  };
  return we("online", t), we("offline", n), () => {
    ye("online", t), ye("offline", n);
  };
}, Tt = {
  isOnline: vt,
  isVisible: Rt
}, gt = {
  initFocus: mt,
  initReconnect: Ot
}, Ke = !te.useId, ee = !ce || "Deno" in globalThis, wt = (e) => _t() ? window.requestAnimationFrame(e) : setTimeout(e, 1), he = ee ? at : ct, Se = typeof navigator < "u" && navigator.connection, $e = !ee && Se && ([
  "slow-2g",
  "2g"
].includes(Se.effectiveType) || Se.saveData), ae = /* @__PURE__ */ new WeakMap(), _e = (e, t) => Oe.prototype.toString.call(e) === `[object ${t}]`;
let yt = 0;
const De = (e) => {
  const t = typeof e, n = _e(e, "Date"), s = _e(e, "RegExp"), a = _e(e, "Object");
  let o, c;
  if (Oe(e) === e && !n && !s) {
    if (o = ae.get(e), o) return o;
    if (o = ++yt + "~", ae.set(e, o), Array.isArray(e)) {
      for (o = "@", c = 0; c < e.length; c++)
        o += De(e[c]) + ",";
      ae.set(e, o);
    }
    if (a) {
      o = "#";
      const p = Oe.keys(e).sort();
      for (; !f(c = p.pop()); )
        f(e[c]) || (o += c + ":" + De(e[c]) + ",");
      ae.set(e, o);
    }
  } else
    o = n ? e.toJSON() : t == "symbol" ? e.toString() : t == "string" ? JSON.stringify(e) : "" + e;
  return o;
}, Le = (e) => {
  if (N(e))
    try {
      e = e();
    } catch {
      e = "";
    }
  const t = e;
  return e = typeof e == "string" ? e : (Array.isArray(e) ? e.length : e) ? De(e) : "", [
    e,
    t
  ];
};
let Dt = 0;
const Ae = () => ++Dt, Xe = 0, Qe = 1, Ze = 2, At = 3;
var Z = {
  __proto__: null,
  ERROR_REVALIDATE_EVENT: At,
  FOCUS_EVENT: Xe,
  MUTATE_EVENT: Ze,
  RECONNECT_EVENT: Qe
};
async function et(...e) {
  const [t, n, s, a] = e, o = j({
    populateCache: !0,
    throwOnError: !0
  }, typeof a == "boolean" ? {
    revalidate: a
  } : a || {});
  let c = o.populateCache;
  const p = o.rollbackOnError;
  let h = o.optimisticData;
  const w = (d) => typeof p == "function" ? p(d) : p !== !1, v = o.throwOnError;
  if (N(n)) {
    const d = n, i = [], E = t.keys();
    for (const l of E)
      // Skip the special useSWRInfinite and useSWRSubscription keys.
      !/^\$(inf|sub)\$/.test(l) && d(t.get(l)._k) && i.push(l);
    return Promise.all(i.map(u));
  }
  return u(n);
  async function u(d) {
    const [i] = Le(d);
    if (!i) return;
    const [E, l] = Ye(t, i), [A, r, W, X] = F.get(t), M = () => {
      const V = A[i];
      return (N(o.revalidate) ? o.revalidate(E().data, d) : o.revalidate !== !1) && (delete W[i], delete X[i], V && V[0]) ? V[0](Ze).then(() => E().data) : E().data;
    };
    if (e.length < 3)
      return M();
    let T = s, C;
    const G = Ae();
    r[i] = [
      G,
      0
    ];
    const m = !f(h), K = E(), I = K.data, $ = K._c, q = f($) ? I : $;
    if (m && (h = N(h) ? h(q, I) : h, l({
      data: h,
      _c: q
    })), N(T))
      try {
        T = T(q);
      } catch (V) {
        C = V;
      }
    if (T && Je(T))
      if (T = await T.catch((V) => {
        C = V;
      }), G !== r[i][0]) {
        if (C) throw C;
        return T;
      } else C && m && w(C) && (c = !0, l({
        data: q,
        _c: D
      }));
    if (c && !C)
      if (N(c)) {
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
    if (r[i][1] = Ae(), Promise.resolve(M()).then(() => {
      l({
        _c: D
      });
    }), C) {
      if (v) throw C;
      return;
    }
    return T;
  }
}
const Be = (e, t) => {
  for (const n in e)
    e[n][0] && e[n][0](t);
}, Ct = (e, t) => {
  if (!F.has(e)) {
    const n = j(gt, t), s = {}, a = et.bind(D, e);
    let o = P;
    const c = {}, p = (v, u) => {
      const d = c[v] || [];
      return c[v] = d, d.push(u), () => d.splice(d.indexOf(u), 1);
    }, h = (v, u, d) => {
      e.set(v, u);
      const i = c[v];
      if (i)
        for (const E of i)
          E(u, d);
    }, w = () => {
      if (!F.has(e) && (F.set(e, [
        s,
        {},
        {},
        {},
        a,
        h,
        p
      ]), !ee)) {
        const v = n.initFocus(setTimeout.bind(D, Be.bind(D, s, Xe))), u = n.initReconnect(setTimeout.bind(D, Be.bind(D, s, Qe)));
        o = () => {
          v && v(), u && u(), F.delete(e);
        };
      }
    };
    return w(), [
      e,
      a,
      w,
      o
    ];
  }
  return [
    e,
    F.get(e)[4]
  ];
}, Lt = (e, t, n, s, a) => {
  const o = n.errorRetryCount, c = a.retryCount, p = ~~((Math.random() + 0.5) * (1 << (c < 8 ? c : 8))) * n.errorRetryInterval;
  !f(o) && c > o || setTimeout(s, p, a);
}, Vt = me, [tt, It] = Ct(/* @__PURE__ */ new Map()), bt = j(
  {
    // events
    onLoadingSlow: P,
    onSuccess: P,
    onError: P,
    onErrorRetry: Lt,
    onDiscarded: P,
    // switches
    revalidateOnFocus: !0,
    revalidateOnReconnect: !0,
    revalidateIfStale: !0,
    shouldRetryOnError: !0,
    // timeouts
    errorRetryInterval: $e ? 1e4 : 5e3,
    focusThrottleInterval: 5 * 1e3,
    dedupingInterval: 2 * 1e3,
    loadingTimeout: $e ? 5e3 : 3e3,
    // providers
    compare: Vt,
    isPaused: () => !1,
    cache: tt,
    mutate: It,
    fallback: {}
  },
  // use web preset by default
  Tt
), Nt = (e, t) => {
  const n = j(e, t);
  if (t) {
    const { use: s, fallback: a } = e, { use: o, fallback: c } = t;
    s && o && (n.use = s.concat(o)), a && c && (n.fallback = j(a, c));
  }
  return n;
}, xt = ke({}), Ut = "$inf$", nt = ce && window.__SWR_DEVTOOLS_USE__, Ft = nt ? window.__SWR_DEVTOOLS_USE__ : [], Wt = () => {
  nt && (window.__SWR_DEVTOOLS_REACT__ = te);
}, Mt = (e) => N(e[1]) ? [
  e[0],
  e[1],
  e[2] || {}
] : [
  e[0],
  null,
  (e[1] === null ? e[2] : e[1]) || {}
], Pt = () => j(bt, ze(xt)), jt = (e) => (t, n, s) => e(t, n && ((...o) => {
  const [c] = Le(t), [, , , p] = F.get(tt);
  if (c.startsWith(Ut))
    return n(...o);
  const h = p[c];
  return f(h) ? n(...o) : (delete p[c], h);
}), s), qt = Ft.concat(jt), Ht = (e) => function(...n) {
  const s = Pt(), [a, o, c] = Mt(n), p = Nt(s, c);
  let h = e;
  const { use: w } = p, v = (w || []).concat(qt);
  for (let u = v.length; u--; )
    h = v[u](h);
  return h(a, o || p.fetcher || null, p);
}, Gt = (e, t, n) => {
  const s = t[e] || (t[e] = []);
  return s.push(n), () => {
    const a = s.indexOf(n);
    a >= 0 && (s[a] = s[s.length - 1], s.pop());
  };
};
Wt();
const ve = te.use || // This extra generic is to avoid TypeScript mixing up the generic and JSX sytax
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
}), Re = {
  dedupe: !0
}, Kt = (e, t, n) => {
  const { cache: s, compare: a, suspense: o, fallbackData: c, revalidateOnMount: p, revalidateIfStale: h, refreshInterval: w, refreshWhenHidden: v, refreshWhenOffline: u, keepPreviousData: d } = n, [i, E, l, A] = F.get(s), [r, W] = Le(e), X = H(!1), M = H(!1), T = H(r), C = H(t), G = H(n), m = () => G.current, K = () => m().isVisible() && m().isOnline(), [I, $, q, V] = Ye(s, r), B = H({}).current, ne = f(c) ? f(n.fallback) ? D : n.fallback[r] : c, Ve = (S, _) => {
    for (const g in B) {
      const R = g;
      if (R === "data") {
        if (!a(S[R], _[R]) && (!f(S[R]) || !a(se, _[R])))
          return !1;
      } else if (_[R] !== S[R])
        return !1;
    }
    return !0;
  }, Ie = ut(() => {
    const S = !r || !t ? !1 : f(p) ? m().isPaused() || o ? !1 : h !== !1 : p, _ = (y) => {
      const x = j(y);
      return delete x._k, S ? {
        isValidating: !0,
        isLoading: !0,
        ...x
      } : x;
    }, g = I(), R = V(), b = _(g), Y = g === R ? b : _(R);
    let O = b;
    return [
      () => {
        const y = _(I());
        return Ve(y, O) ? (O.data = y.data, O.isLoading = y.isLoading, O.isValidating = y.isValidating, O.error = y.error, O) : (O = y, y);
      },
      () => Y
    ];
  }, [
    s,
    r
  ]), k = St.useSyncExternalStore(fe(
    (S) => q(r, (_, g) => {
      Ve(g, _) || S();
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      s,
      r
    ]
  ), Ie[0], Ie[1]), be = !X.current, rt = i[r] && i[r].length > 0, z = k.data, J = f(z) ? ne && Je(ne) ? ve(ne) : ne : z, re = k.error, Ne = H(J), se = d ? f(z) ? Ne.current : z : J, xe = rt && !f(re) ? !1 : be && !f(p) ? p : m().isPaused() ? !1 : o ? f(J) ? !1 : h : f(J) || h, Ue = !!(r && t && be && xe), st = f(k.isValidating) ? Ue : k.isValidating, ot = f(k.isLoading) ? Ue : k.isLoading, Q = fe(
    async (S) => {
      const _ = C.current;
      if (!r || !_ || M.current || m().isPaused())
        return !1;
      let g, R, b = !0;
      const Y = S || {}, O = !l[r] || !Y.dedupe, y = () => Ke ? !M.current && r === T.current && X.current : r === T.current, x = {
        isValidating: !1,
        isLoading: !1
      }, We = () => {
        $(x);
      }, Me = () => {
        const L = l[r];
        L && L[1] === R && delete l[r];
      }, Pe = {
        isValidating: !0
      };
      f(I().data) && (Pe.isLoading = !0);
      try {
        if (O && ($(Pe), n.loadingTimeout && f(I().data) && setTimeout(() => {
          b && y() && m().onLoadingSlow(r, n);
        }, n.loadingTimeout), l[r] = [
          _(W),
          Ae()
        ]), [g, R] = l[r], g = await g, O && setTimeout(Me, n.dedupingInterval), !l[r] || l[r][1] !== R)
          return O && y() && m().onDiscarded(r), !1;
        x.error = D;
        const L = E[r];
        if (!f(L) && // case 1
        (R <= L[0] || // case 2
        R <= L[1] || // case 3
        L[1] === 0))
          return We(), O && y() && m().onDiscarded(r), !1;
        const U = I().data;
        x.data = a(U, g) ? U : g, O && y() && m().onSuccess(g, r, n);
      } catch (L) {
        Me();
        const U = m(), { shouldRetryOnError: ue } = U;
        U.isPaused() || (x.error = L, O && y() && (U.onError(L, r, U), (ue === !0 || N(ue) && ue(L)) && (!m().revalidateOnFocus || !m().revalidateOnReconnect || K()) && U.onErrorRetry(L, r, U, (it) => {
          const le = i[r];
          le && le[0] && le[0](Z.ERROR_REVALIDATE_EVENT, it);
        }, {
          retryCount: (Y.retryCount || 0) + 1,
          dedupe: !0
        })));
      }
      return b = !1, We(), !0;
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
      s
    ]
  ), Fe = fe(
    // Use callback to make sure `keyRef.current` returns latest result every time
    (...S) => et(s, T.current, ...S),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (he(() => {
    C.current = t, G.current = n, f(z) || (Ne.current = z);
  }), he(() => {
    if (!r) return;
    const S = Q.bind(D, Re);
    let _ = 0;
    const R = Gt(r, i, (b, Y = {}) => {
      if (b == Z.FOCUS_EVENT) {
        const O = Date.now();
        m().revalidateOnFocus && O > _ && K() && (_ = O + m().focusThrottleInterval, S());
      } else if (b == Z.RECONNECT_EVENT)
        m().revalidateOnReconnect && K() && S();
      else {
        if (b == Z.MUTATE_EVENT)
          return Q();
        if (b == Z.ERROR_REVALIDATE_EVENT)
          return Q(Y);
      }
    });
    return M.current = !1, T.current = r, X.current = !0, $({
      _k: W
    }), xe && (f(J) || ee ? S() : wt(S)), () => {
      M.current = !0, R();
    };
  }, [
    r
  ]), he(() => {
    let S;
    function _() {
      const R = N(w) ? w(I().data) : w;
      R && S !== -1 && (S = setTimeout(g, R));
    }
    function g() {
      !I().error && (v || m().isVisible()) && (u || m().isOnline()) ? Q(Re).then(_) : _();
    }
    return _(), () => {
      S && (clearTimeout(S), S = -1);
    };
  }, [
    w,
    v,
    u,
    r
  ]), lt(se), o && f(J) && r) {
    if (!Ke && ee)
      throw new Error("Fallback data is required when using Suspense in SSR.");
    C.current = t, G.current = n, M.current = !1;
    const S = A[r];
    if (!f(S)) {
      const _ = Fe(S);
      ve(_);
    }
    if (f(re)) {
      const _ = Q(Re);
      f(se) || (_.status = "fulfilled", _.value = !0), ve(_);
    } else
      throw re;
  }
  return {
    mutate: Fe,
    get data() {
      return B.data = !0, se;
    },
    get error() {
      return B.error = !0, re;
    },
    get isValidating() {
      return B.isValidating = !0, st;
    },
    get isLoading() {
      return B.isLoading = !0, ot;
    }
  };
}, $t = Ht(Kt), Bt = (...e) => fetch(...e).then((t) => {
  if (!t.ok)
    throw new Error(t.statusText);
  return t.json();
}), kt = (e) => {
  const t = Array.isArray(e) ? e[0] : e;
  if (typeof t != "string")
    throw new Error(
      "useSWRFetcher: key must be a url string or a [url, ...] tuple"
    );
  return t;
}, Xt = (e, t) => t && e ? [e, t] : !1, Qt = (e, t, n) => $t(
  e,
  async (s) => Bt(kt(s), t),
  n
), zt = (e) => {
  switch (e) {
    case "development":
      return "http://localhost:3000";
    case "staging":
      return "https://staging.deva.me";
    case "production":
      return "https://www.deva.me";
  }
}, Zt = (e, t) => t ?? zt(e);
export {
  dt as D,
  Yt as a,
  Xt as b,
  zt as e,
  Bt as f,
  Zt as r,
  Qt as u
};
