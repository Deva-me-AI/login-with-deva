import type {
  DevaAllowance,
  DevaChatInput,
  DevaChatResponse,
  DevaModels,
} from "./ai-types";
export type {
  DevaAllowance,
  DevaChatInput,
  DevaChatResponse,
  DevaModels,
} from "./ai-types";

export type DevaAIErrorCode =
  | "unauthenticated"
  | "missing_scope"
  | "app_budget_exceeded"
  | "insufficient_credits"
  | "rate_limited";
export class DevaAIError extends Error {
  readonly name = "DevaAIError";
  constructor(
    public readonly code: DevaAIErrorCode,
    public readonly status: number,
  ) {
    super(code);
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let code: DevaAIErrorCode | undefined;
    if (response.status === 401) code = "unauthenticated";
    if (response.status === 403) code = "missing_scope";
    if (response.status === 429) code = "rate_limited";
    if (response.status === 402) {
      const body: unknown = await response.json().catch(() => null);
      if (
        body &&
        typeof body === "object" &&
        "detail" in body &&
        body.detail &&
        typeof body.detail === "object" &&
        "reason" in body.detail
      ) {
        const reason = body.detail.reason;
        if (
          reason === "app_budget_exceeded" ||
          reason === "insufficient_credits"
        )
          code = reason;
      }
    }
    if (code) throw new DevaAIError(code, response.status);
    // Do not expose upstream response bodies (which may contain private details).
    throw new Error(`Deva request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

/** Use only on your backend. Never serialize this client's access token to a browser. */
export function createDevaAI({
  accessToken,
  baseUrl = "https://api.deva.me",
}: {
  accessToken: string;
  baseUrl?: string;
}) {
  const request = async <T>(path: string, body?: DevaChatInput): Promise<T> =>
    readResponse<T>(
      await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
        method: body ? "POST" : "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        cache: "no-store",
        redirect: "error",
      }),
    );
  return {
    chat: ({ model = "user-default", messages, max_tokens }: DevaChatInput) =>
      request<DevaChatResponse>("/v1/chat/completions", {
        model,
        messages,
        ...(max_tokens === undefined ? {} : { max_tokens }),
      }),
    models: () => request<DevaModels>("/v1/models"),
    allowance: () => request<DevaAllowance>("/v1/credits/app-allowance"),
  };
}

export type DevaTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
};
/** Exchange a server callback's validated authorization code using PKCE. */
export async function exchangeCode({
  clientId,
  clientSecret,
  code,
  codeVerifier,
  redirectUri,
  tokenEndpoint = "https://www.deva.me/api/sso/token",
}: {
  clientId: string;
  clientSecret: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
  tokenEndpoint?: string;
}): Promise<DevaTokenResponse> {
  return readResponse<DevaTokenResponse>(
    await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
      redirect: "error",
    }),
  );
}
