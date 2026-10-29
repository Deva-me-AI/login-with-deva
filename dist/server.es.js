var s = Object.defineProperty;
var d = (t, a, e) => a in t ? s(t, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[a] = e;
var n = (t, a, e) => d(t, typeof a != "symbol" ? a + "" : a, e);
class u extends Error {
  constructor(e, r) {
    super(e);
    n(this, "name", "DevaAIError");
    this.code = e, this.status = r;
  }
}
async function o(t) {
  if (!t.ok) {
    let a;
    if (t.status === 401 && (a = "unauthenticated"), t.status === 403 && (a = "missing_scope"), t.status === 429 && (a = "rate_limited"), t.status === 402) {
      const e = await t.json().catch(() => null);
      if (e && typeof e == "object" && "detail" in e && e.detail && typeof e.detail == "object" && "reason" in e.detail) {
        const r = e.detail.reason;
        (r === "app_budget_exceeded" || r === "insufficient_credits") && (a = r);
      }
    }
    throw a ? new u(a, t.status) : new Error(`Deva request failed (${t.status})`);
  }
  return t.json();
}
function f({
  accessToken: t,
  baseUrl: a = "https://api.deva.me"
}) {
  const e = async (r, i) => o(
    await fetch(`${a.replace(/\/$/, "")}${r}`, {
      method: i ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${t}`,
        ...i ? { "Content-Type": "application/json" } : {}
      },
      ...i ? { body: JSON.stringify(i) } : {},
      cache: "no-store",
      redirect: "error"
    })
  );
  return {
    chat: ({ model: r = "user-default", messages: i, max_tokens: c }) => e("/v1/chat/completions", {
      model: r,
      messages: i,
      ...c === void 0 ? {} : { max_tokens: c }
    }),
    models: () => e("/v1/models"),
    allowance: () => e("/v1/credits/app-allowance")
  };
}
async function h({
  clientId: t,
  clientSecret: a,
  code: e,
  codeVerifier: r,
  redirectUri: i,
  tokenEndpoint: c = "https://www.deva.me/api/sso/token"
}) {
  return o(
    await fetch(c, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: t,
        client_secret: a,
        code: e,
        code_verifier: r,
        redirect_uri: i
      }),
      cache: "no-store",
      redirect: "error"
    })
  );
}
export {
  u as DevaAIError,
  f as createDevaAI,
  h as exchangeCode
};
