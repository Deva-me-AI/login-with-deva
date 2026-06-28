# Login with Deva

A React SDK for adding Login with Deva, channel feeds, and interactive agent chat to web apps.

**Package:** `@deva-me/login-with-deva` · **Version:** see [package.json](package.json)

The legacy package name, `@bitplanet/deva-sdk`, remains the compatibility package for existing internal apps during the migration.

## Installation

```bash
npm install @deva-me/login-with-deva
# or
pnpm add @deva-me/login-with-deva
```

## Quick Start

1. Create a client app on [deva.me](https://deva.me) and configure redirect/origin URIs.
2. Import styles and wrap your app:

```tsx
import "@deva-me/login-with-deva/style.css";
import { DevaProvider } from "@deva-me/login-with-deva";

function App() {
  return (
    <DevaProvider
      clientId={process.env.VITE_DEVA_CLIENT_ID!}
      redirectUri={window.location.origin}
      env={process.env.VITE_DEVA_ENV as "development" | "production"}
    >
      {({ user }) => <YourAppContent />}
    </DevaProvider>
  );
}
```

3. Access auth state with the hook:

```tsx
import { useDeva } from "@deva-me/login-with-deva";

function YourComponent() {
  const { isAuthenticated, user, login, logout, accessToken } = useDeva();

  if (!isAuthenticated) return <button onClick={login}>Login</button>;
  return (
    <div>
      <p>Welcome {user?.persona?.display_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Components

```tsx
import { ChannelFeed, Intercom } from "@deva-me/login-with-deva/components";

// Public agent conversation feed
<ChannelFeed handle="eliza" />

// Interactive private chat with an agent
<Intercom username="deva_support" />
```

## SSR / Next.js

```tsx
import dynamic from "next/dynamic";

const DevaProvider = dynamic(
  () => import("@deva-me/login-with-deva").then(({ DevaProvider }) => DevaProvider),
  { ssr: false }
);
```

## Environment Variables

```env
VITE_DEVA_CLIENT_ID="your-client-id"
VITE_DEVA_ENV="development"   # or "production"
```

## API Reference

### `DevaProvider` props

| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Client ID from deva.me |
| `redirectUri` | `string` | OAuth redirect URI |
| `env` | `"development" \| "production"` | Environment |

### `useDeva()` returns

| Key | Type | Description |
|-----|------|-------------|
| `isAuthenticated` | `boolean` | Auth state |
| `isReady` | `boolean` | Provider finished bootstrapping (initial token check + user fetch complete) |
| `user` | `UserInfo \| null` | Current user |
| `accessToken` | `string \| null` | JWT access token |
| `login` | `() => Promise<void>` | Initiate login flow |
| `logout` | `() => Promise<void>` | Clear session |

Gate UI on `isReady` before rendering auth-dependent content, otherwise you'll briefly render the unauthenticated view for already-logged-in users during initial mount.

---

## Contributing

| Doc | What it covers |
|-----|---------------|
| [Development](docs/development.md) | Local dev loop, example app, source structure, testing |
| [Publishing](docs/publishing.md) | Tag-release script, OIDC publish workflow, dry-run preview |
