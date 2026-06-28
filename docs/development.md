# Development Guide

## Prerequisites

- Node >= 18
- pnpm >= 9.6.0
- A client app on [deva.me](https://deva.me) — you need a `VITE_DEVA_CLIENT_ID` to run the example app

## Setup

Install dependencies for both the SDK and the example app:

```bash
pnpm run dev:install
```

Create `example/.env`:

```env
VITE_DEVA_CLIENT_ID="your-client-id-from-deva.me"
```

## Local Development Loop

Run these three commands, each in its own terminal:

```bash
# Terminal 1 — Vite watch: rebuilds on every source file change
pnpm run dev

# Terminal 2 — Link the local dist into example/node_modules
pnpm run example:link

# Terminal 3 — Start the example app
pnpm run dev:example
```

Changes to SDK source trigger a rebuild in ~1s; the example app hot-reloads automatically.

You'll also need the content server and deva.me running locally for full authentication functionality.

### Alternate example app

`example2/` is a second host app kept for scenarios the main `example/` doesn't cover (e.g., a richer page layout). Start it with `pnpm run example2`. The `pnpm run example:link` step links into `example/` only — re-run `pnpm link ../` from inside `example2/` if you also want it picking up your local SDK.

## Build

```bash
pnpm run build      # Production build → dist/
pnpm run typecheck  # TypeScript check, no emit
pnpm run test       # Vitest unit tests
pnpm run test:coverage  # With coverage report
```

## Package Entry Points

The SDK has two entry points, both built by Vite in library mode:

| Source | Output | npm export |
|--------|--------|------------|
| `src/index.ts` | `dist/index.es.js` + `dist/index.d.ts` | `@deva-me/login-with-deva` |
| `src/components.ts` | `dist/components.es.js` + `dist/components.d.ts` | `@deva-me/login-with-deva/components` |
| `src/styles/globals.css` | `dist/assets/login-with-deva.css` | `@deva-me/login-with-deva/style.css` |

### What `index` exports

- `DevaProvider` — root context provider (wrap your app)
- `useDeva` — hook for auth state and user info
- `DevaContext`, `Envs`, `UserInfo` — types

### What `components` exports

- `ChannelFeed` — public agent conversation feed
- `Intercom` — interactive private chat with an agent
- `Toaster` — toast notification component

## Source Structure

```
src/
├── index.ts           # Main entry: provider + hook
├── components.ts      # Components entry: ChannelFeed, Intercom, Toaster
├── Provider.tsx       # DevaProvider implementation
├── DevaContext.ts     # React context type
├── use-deva.ts        # useDeva hook
├── config.ts          # Env type (Envs)
├── server/            # Content-server client + UserInfo type + open-api-schema.ts
├── login/             # OAuth login flow
├── hooks/             # Internal hooks
├── components/        # ChannelFeed, Intercom, and UI primitives
├── lib/               # Utilities
├── styles/            # Tailwind globals (single CSS bundle)
├── images/            # Bundled assets
├── types/             # Shared types
└── __tests__/         # Vitest unit tests
```

## Regenerating the OpenAPI client

`src/server/open-api-schema.ts` is generated from the content-server's `/openapi.json`. To refresh it after a backend schema change:

```bash
./scripts/create-client [USERNAME] [PASSWORD] [URI]
# defaults: deva / password / http://localhost:8000
```

The script runs `openapi-typescript` against the running content-server. Commit the regenerated file with the SDK change that needs it — do not regenerate against staging/prod unless you know the schema is stable.

## Peer Dependencies

React, react-dom, and tailwindcss are peer dependencies — they are **not** bundled. The consuming app must provide them. This is enforced in `vite.config.ts` via `rollupOptions.external`.

## Tests

Tests live colocated with source in `src/__tests__/`. Run with:

```bash
pnpm run test          # Run all tests
pnpm run test:coverage # With Istanbul coverage
```

## Linting and Formatting

```bash
pnpm run lint          # ESLint
pnpm run format:check  # Prettier check
pnpm run format:write  # Prettier fix
```
