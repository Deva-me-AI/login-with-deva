# deva-sdk — Claude Guidelines

## What This Repo Is

A React component library and hook collection published as `@bitplanet/deva-sdk` on npm. Built with Vite in library mode. Exports two entry points: `index` (provider + hook) and `components` (ChannelFeed, Intercom, Toaster).

## Key Files to Read First

- `src/index.ts` — main entry, exports public API
- `src/components.ts` — components entry, exports UI components
- `vite.config.ts` — build configuration (library mode, entry points, externals)
- `docs/development.md` — local dev loop and source structure

## Build System

Vite library mode with `vite-plugin-dts` for TypeScript declarations. Output format is ES modules only — no CommonJS build.

**External dependencies (NOT bundled):** `react`, `react-dom`, `react/jsx-runtime`, `tailwindcss`. These are peer dependencies. Never import them in a way that would bundle them.

**Build command:** `pnpm run build` → outputs to `dist/`. The `prepack` hook runs this automatically before `npm pack`.

## Coding Patterns

### Exports are the public API — be deliberate

Only export from `src/index.ts` and `src/components.ts`. Adding an export is a public commitment. Internal utilities stay inside `src/lib/` or `src/hooks/` without being re-exported.

### No direct DOM manipulation

This is a React library. Use refs and React's event system. No `document.querySelector`, no `window` access at module load time (SSR compatibility).

### CSS goes in `src/styles/globals.css`

The CSS is bundled separately as `dist/assets/deva-sdk.css` and exported as `@bitplanet/deva-sdk/style.css`. Keep component-specific styles in the same CSS file via Tailwind classes. Don't use CSS modules or CSS-in-JS.

### Types are part of the API

All exported components and hooks should have explicit TypeScript types. The `vite-plugin-dts` plugin generates declaration files — if TypeScript can't infer a type, the `.d.ts` output will be wrong.

## Testing

Tests live in `src/__tests__/`. Run with `pnpm run test`. Coverage with `pnpm run test:coverage`.

Do not test internal implementation details — test the public hook and component behavior. Avoid mocking React itself; use `@testing-library/react` patterns.

## Release Process

See `docs/publishing.md`. In short:

```bash
./scripts/tag-release patch   # bump, commit, tag, push → GitHub Actions publishes
```

Never manually edit `package.json` version and push a tag separately — use the script. Never run `npm publish` locally — always let CI do it via the OIDC workflow.

## Common Mistakes

- **Adding a new export to `src/lib/` directly** — exports must go through `src/index.ts` or `src/components.ts`
- **Importing `react` at the top of files that run in SSR** — use lazy imports or check `typeof window` if needed
- **Adding `react` or `react-dom` to `dependencies` instead of `peerDependencies`** — this would bundle React twice in the consumer's app
- **Running `npm publish` locally** — the local build environment may differ; always use CI
- **Forgetting `pnpm run example:link` after `pnpm run build`** — the example app won't pick up changes without re-linking
