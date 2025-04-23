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
