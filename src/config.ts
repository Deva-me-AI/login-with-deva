// TODO: move env
export type Envs = "development" | "staging" | "production";

export const envToUrl = (env: Envs) => {
  switch (env) {
    case "development":
      return "http://localhost:3000";
    case "staging":
      return "https://staging.deva.me";
    case "production":
      return "https://www.deva.me";
  }
};

/**
 * Resolve the Deva base URL the SDK talks to. An explicit `baseUrl` overrides
 * the `env` mapping — use it to point the SDK at a local IdP on any host/port
 * (e.g. a local endeva on "http://localhost:3001") for development/testing.
 * When omitted, the URL is derived from `env`.
 */
export const resolveDevaUrl = (env: Envs, baseUrl?: string): string =>
  baseUrl ?? envToUrl(env);
