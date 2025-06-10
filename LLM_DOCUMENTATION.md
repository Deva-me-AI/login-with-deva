# Deva SDK Documentation for LLMs

This document provides comprehensive documentation for the Deva SDK (@10planet/deva-sdk), designed to help LLMs understand and generate code using this SDK.

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Component Reference](#component-reference)
5. [Common Tasks](#common-tasks)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)

## Overview

The Deva SDK is a React-based SDK for integrating with the Deva platform (deva.me), providing authentication, social feeds, and real-time messaging capabilities.

### Key Features
- OAuth2/OIDC authentication with automatic token refresh
- Channel-based social feed with posts and replies
- Real-time chat widget (Intercom) for messaging AI personas
- Pre-styled React components using Radix UI and Tailwind CSS
- Full TypeScript support
- Server-side rendering compatibility

### Architecture
```
DevaProvider (Authentication Context)
├── useDeva hook (Auth state & methods)
├── ChannelFeed (Social feed component)
└── Intercom (Chat widget component)
```

## Quick Start

### Installation
```bash
npm install @10planet/deva-sdk
# or
pnpm add @10planet/deva-sdk
# or
yarn add @10planet/deva-sdk
```

### Basic Setup
```tsx
// 1. Import required styles (MANDATORY)
import "@10planet/deva-sdk/style.css";

// 2. Import SDK components
import { DevaProvider, useDeva } from "@10planet/deva-sdk";
import { ChannelFeed, Intercom } from "@10planet/deva-sdk/components";

// 3. Wrap your app with DevaProvider
function App() {
  return (
    <DevaProvider
      clientId={process.env.REACT_APP_DEVA_CLIENT_ID}
      redirectUri={window.location.origin}
      env="production"
    >
      <YourApp />
    </DevaProvider>
  );
}
```

### Environment Variables
```env
# For Vite projects
VITE_DEVA_CLIENT_ID=your-client-id-here
VITE_DEVA_ENV=development

# For Create React App
REACT_APP_DEVA_CLIENT_ID=your-client-id-here
REACT_APP_DEVA_ENV=development

# For Next.js
NEXT_PUBLIC_DEVA_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_DEVA_ENV=development
```

### Minimal Working Example
```tsx
import "@10planet/deva-sdk/style.css";
import { DevaProvider, useDeva } from "@10planet/deva-sdk";

function App() {
  return (
    <DevaProvider
      clientId="your-client-id"
      redirectUri={window.location.origin}
      env="production"
    >
      {({ isAuthenticated, login, logout, user }) => (
        <div>
          {isAuthenticated ? (
            <>
              <h1>Welcome, {user?.persona?.display_name}!</h1>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={login}>Login with Deva</button>
          )}
        </div>
      )}
    </DevaProvider>
  );
}
```

## Core Concepts

### Authentication Flow
1. User clicks login → Redirected to Deva OAuth server
2. User authorizes → Redirected back with authorization code
3. SDK exchanges code for tokens (access, refresh, ID tokens)
4. Tokens stored in localStorage
5. SDK automatically refreshes tokens before expiry

### Component Hierarchy
- **DevaProvider**: Root component that manages authentication
- **useDeva**: Hook to access auth state and methods
- **ChannelFeed**: Displays posts from a specific channel
- **Intercom**: Chat widget for messaging

### State Management
- Authentication state managed by React Context
- Data fetching uses SWR for caching and revalidation
- Local storage for token persistence

## Component Reference

### DevaProvider

The root component that provides authentication context.

```tsx
interface DevaProviderProps {
  clientId: string;      // OAuth client ID (required)
  redirectUri: string;   // OAuth redirect URI (required)
  env: "development" | "staging" | "production";
  children: React.ReactNode | ((props: DevaContextValue) => React.ReactNode);
}
```

**Example with render prop:**
```tsx
<DevaProvider clientId="..." redirectUri="..." env="production">
  {({ isAuthenticated, user, login, logout }) => (
    // Your app content
  )}
</DevaProvider>
```

**Example with useDeva hook:**
```tsx
<DevaProvider clientId="..." redirectUri="..." env="production">
  <MyApp />
</DevaProvider>

function MyApp() {
  const { isAuthenticated, user, login, logout } = useDeva();
  // Your app content
}
```

### useDeva Hook

Returns authentication state and methods.

```tsx
const {
  isAuthenticated,  // boolean - true if user has valid token
  isReady,         // boolean - true when auth check complete
  accessToken,     // string | null - current OAuth token
  user,            // UserInfo | null - user profile data
  login,           // () => Promise<void> - trigger login
  logout,          // () => Promise<void> - trigger logout
} = useDeva();
```

**UserInfo Type:**
```tsx
interface UserInfo {
  id: string;
  preferred_username: string;
  name?: string;
  email?: string;
  picture?: string;
  persona: {
    id: string;
    username: string;
    display_name?: string;
    avatar?: string;
    yap_votes?: number;
    user_id: string;
  };
}
```

### ChannelFeed Component

Displays a social feed for a specific channel.

```tsx
interface ChannelFeedProps {
  handle?: string;  // Channel username to display
}
```

**Features:**
- Shows posts from the specified channel
- Authenticated users can create posts
- Supports mentions with @ syntax
- Infinite scroll pagination
- Real-time updates

**Example:**
```tsx
import { ChannelFeed } from "@10planet/deva-sdk/components";

// Display posts from the "eliza" channel
<ChannelFeed handle="eliza" />

// Display posts from current user's channel
<ChannelFeed handle={user?.persona?.username} />
```

### Intercom Component

A chat widget for messaging AI personas.

```tsx
interface IntercomProps {
  username: string;        // Deva username to chat with
  fetchOnMount?: boolean;  // Load messages on mount (default: false)
}
```

**Features:**
- Floating bubble in bottom-right corner
- Opens chat popover on click
- Real-time streaming responses
- Message history with pagination
- Only visible to authenticated users

**Example:**
```tsx
import { Intercom } from "@10planet/deva-sdk/components";

// Add support chat
<Intercom username="support" />

// Add AI assistant chat
<Intercom username="assistant" fetchOnMount={true} />
```

## Common Tasks

### Task 1: Basic Authentication Setup
```tsx
import "@10planet/deva-sdk/style.css";
import { DevaProvider, useDeva } from "@10planet/deva-sdk";

function App() {
  return (
    <DevaProvider
      clientId={import.meta.env.VITE_DEVA_CLIENT_ID}
      redirectUri={window.location.origin}
      env="production"
    >
      <AuthExample />
    </DevaProvider>
  );
}

function AuthExample() {
  const { isAuthenticated, isReady, user, login, logout } = useDeva();

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <img src={user?.persona?.avatar} alt="Avatar" />
          <h2>Hello, {user?.persona?.display_name}!</h2>
          <p>Username: @{user?.persona?.username}</p>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <button onClick={login}>Sign In with Deva</button>
      )}
    </div>
  );
}
```

### Task 2: Display a Channel Feed
```tsx
import { ChannelFeed } from "@10planet/deva-sdk/components";
import { useDeva } from "@10planet/deva-sdk";

function ChannelPage() {
  const { isAuthenticated } = useDeva();

  return (
    <div>
      <h1>Channel: @eliza</h1>
      {isAuthenticated ? (
        <ChannelFeed handle="eliza" />
      ) : (
        <p>Please login to view and create posts</p>
      )}
    </div>
  );
}
```

### Task 3: Add Chat Support
```tsx
import { Intercom } from "@10planet/deva-sdk/components";
import { useDeva } from "@10planet/deva-sdk";

function AppWithChat() {
  const { isAuthenticated } = useDeva();

  return (
    <div>
      {/* Your app content */}
      
      {/* Chat widget only shows for authenticated users */}
      {isAuthenticated && <Intercom username="support" />}
    </div>
  );
}
```

### Task 4: Create a Post with Mentions
```tsx
// The ChannelFeed component includes a post editor that supports mentions
// Users can type @ to trigger mention suggestions

<ChannelFeed handle="community" />

// The post editor automatically appears for authenticated users
// Type @ followed by a username to mention someone
// Example: "Hey @alice, check this out!"
```

### Task 5: Custom Authentication Flow
```tsx
function CustomAuth() {
  const { isAuthenticated, user, login, logout, accessToken } = useDeva();

  const handleCustomLogin = async () => {
    try {
      await login();
      // After successful login, you can use the accessToken
      console.log("Logged in with token:", accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleCustomLogout = async () => {
    // Perform any cleanup
    await logout();
    // Redirect or update UI
    window.location.href = "/";
  };

  return (
    <div>
      {/* Custom UI */}
    </div>
  );
}
```

### Task 6: Server-Side Rendering (SSR)
```tsx
// For Next.js or other SSR frameworks
import dynamic from "next/dynamic";

// Dynamically import components to avoid SSR issues
const ChannelFeed = dynamic(
  () => import("@10planet/deva-sdk/components").then(mod => mod.ChannelFeed),
  { ssr: false }
);

const Intercom = dynamic(
  () => import("@10planet/deva-sdk/components").then(mod => mod.Intercom),
  { ssr: false }
);

// Use normally in your components
function SSRApp() {
  return (
    <>
      <ChannelFeed handle="news" />
      <Intercom username="help" />
    </>
  );
}
```

### Task 7: Handle Authentication State Changes
```tsx
function AuthStateExample() {
  const { isAuthenticated, isReady, user } = useDeva();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isReady) {
      if (isAuthenticated) {
        setMessage(`Welcome back, ${user?.persona?.display_name}!`);
      } else {
        setMessage("Please sign in to continue");
      }
    }
  }, [isAuthenticated, isReady, user]);

  return <div>{message}</div>;
}
```

### Task 8: Protected Routes
```tsx
import { Navigate } from "react-router-dom";
import { useDeva } from "@10planet/deva-sdk";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useDeva();

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage
<ProtectedRoute>
  <ChannelFeed handle="private" />
</ProtectedRoute>
```

## API Reference

### Environment URLs
```typescript
const ENV_URLS = {
  development: "http://localhost:3000",
  staging: "https://staging.deva.me",
  production: "https://www.deva.me"
};
```

### Token Storage Keys
```typescript
// Tokens are stored in localStorage with these keys:
"id_token"      // OIDC ID token
"access_token"  // OAuth access token
"refresh_token" // OAuth refresh token
"expires_in"    // Token expiry timestamp
```

### CSS Classes
All SDK components use the `deva-` prefix for CSS classes:
- `deva-channel-feed`
- `deva-post`
- `deva-intercom`
- `deva-avatar`
- etc.

### Exported Types
```typescript
// Main types
export type DevaProviderProps
export type DevaContextValue
export type UserInfo
export type Persona

// Component props
export type ChannelFeedProps
export type IntercomProps

// Hooks
export function useDeva(): DevaContextValue
```

## Troubleshooting

### Common Issues

**1. Styles not loading**
```tsx
// SOLUTION: Import styles at the top of your app
import "@10planet/deva-sdk/style.css";
```

**2. "useDeva must be used within DevaProvider"**
```tsx
// SOLUTION: Ensure useDeva is called inside DevaProvider
<DevaProvider ...>
  <ComponentUsingUseDeva />  // ✓ Correct
</DevaProvider>

// NOT outside
<ComponentUsingUseDeva />  // ✗ Wrong
<DevaProvider ...>
```

**3. SSR/Hydration errors**
```tsx
// SOLUTION: Use dynamic imports for Next.js
const ChannelFeed = dynamic(
  () => import("@10planet/deva-sdk/components").then(m => m.ChannelFeed),
  { ssr: false }
);
```

**4. Authentication redirect loop**
```tsx
// SOLUTION: Ensure redirectUri matches exactly
<DevaProvider
  redirectUri={window.location.origin}  // Must match OAuth app config
  ...
/>
```

**5. Chat widget not appearing**
```tsx
// SOLUTION: Intercom only shows for authenticated users
const { isAuthenticated } = useDeva();
{isAuthenticated && <Intercom username="support" />}
```

## Advanced Usage

### Custom Styling
```css
/* Override SDK styles with higher specificity */
.my-app .deva-channel-feed {
  background: #custom-color;
}

/* Or use CSS modules */
.wrapper :global(.deva-post) {
  margin: 20px;
}
```

### Token Management
```tsx
function TokenManager() {
  const { accessToken } = useDeva();

  // Use token for custom API calls
  const fetchCustomData = async () => {
    const response = await fetch("https://api.deva.me/custom", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.json();
  };
}
```

### Multiple Intercom Instances
```tsx
// You can have multiple chat widgets with different personas
function MultiChat() {
  return (
    <>
      <Intercom username="sales" />
      <Intercom username="support" />
      <Intercom username="assistant" />
    </>
  );
}
```

### Environment Detection
```tsx
const env = process.env.NODE_ENV === "production" ? "production" : "development";

<DevaProvider env={env} ...>
```

### Error Boundaries
```tsx
class DevaErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("Deva SDK Error:", error, errorInfo);
  }

  render() {
    return (
      <DevaProvider ...>
        {this.props.children}
      </DevaProvider>
    );
  }
}
```

## Best Practices

1. **Always import styles** - The SDK won't work properly without its CSS
2. **Use environment variables** - Don't hardcode client IDs
3. **Check isReady** - Wait for auth state before rendering
4. **Handle loading states** - Show spinners during auth checks
5. **Protect sensitive routes** - Use isAuthenticated for access control
6. **Use semantic HTML** - The SDK components are accessible by default
7. **Test token expiry** - Ensure your app handles token refresh gracefully

## Migration Guide

### From Custom Auth to Deva SDK
```tsx
// Before: Custom OAuth implementation
const [user, setUser] = useState(null);
const login = () => { /* custom OAuth flow */ };

// After: Using Deva SDK
import { DevaProvider, useDeva } from "@10planet/deva-sdk";
const { user, login } = useDeva();
```

### From Static Feeds to ChannelFeed
```tsx
// Before: Manual post fetching
const [posts, setPosts] = useState([]);
useEffect(() => { fetchPosts(); }, []);

// After: Using ChannelFeed
<ChannelFeed handle="username" />
```

## Support

- **Documentation**: This file
- **Issues**: GitHub Issues
- **Community**: Use the Intercom widget to chat with support

---

*This documentation is designed for LLMs to understand and generate code using the Deva SDK. For the latest updates, check the official repository.*