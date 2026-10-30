# Deva credits with Next.js

1. Register a confidential Deva client allowed to request `OPENID` and
   `AI_COMPLETIONS`. Register `http://localhost:3000/api/deva/callback` as its
   redirect URI. Credits require a Deva deployment supporting that scope.
2. From the SDK root, run `pnpm install --frozen-lockfile && pnpm build`.
3. Here, run `pnpm install --frozen-lockfile`, copy `.env.example` to `.env.local`,
   and fill in your client credentials. Never prefix secrets with `NEXT_PUBLIC_`.
4. Run `pnpm build && pnpm start`, then open `http://localhost:3000`.
5. Log in, approve the monthly limit shown by Deva, and send a message. The model
   field starts with `user-default`; the reply displays the actual model used.

This is a single-process teaching example: tokens, OAuth state and PKCE verifiers
live in an expiring in-memory server store. Restarting the process logs users out.
Before deploying across workers or serverless instances, replace the Map with a
shared server-side session store with expiry and atomic OAuth state consumption.
Only an opaque session ID reaches an HttpOnly, SameSite cookie (Secure on HTTPS).
Tokens never appear in browser storage, props, responses, or client JavaScript.

The callback validates state, consumes it once, exchanges the code on the server,
and rotates the session ID. The chat route checks the request Origin against the
configured APP_ORIGIN, requires a live session, validates one user message, and
caps output at 512 tokens. It ignores browser-provided token limits. Login expires
after at most one hour; sign in again to renew. Use HTTPS and set APP_ORIGIN to
your canonical origin when hosted. No refresh tokens are retained by this example.

The provider's browser login is intentionally not used: this app owns the entire
BFF authorization flow. `useDevaAI` talks only to `/api/deva/chat`.
