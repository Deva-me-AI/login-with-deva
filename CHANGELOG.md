# Changelog

## 0.12.0

- Remove unused `geist` and its transitive Next.js dependency.
- Add provider-level authorization scopes with per-login overrides.
- Add the React-free `/server` entry with `createDevaAI`, typed spending errors,
  model and app-allowance reads, and confidential PKCE code exchange.
- Add `useDevaAI` for calls through an application's own backend.
- Add a Next.js credits example with server-side sessions and a model selector.
- Preserve existing chat and rich-text component exports. No npm publication.
