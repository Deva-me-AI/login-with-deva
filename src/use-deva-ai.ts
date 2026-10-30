import { useCallback, useState } from "react";
import type { DevaChatInput, DevaChatResponse } from "./ai-types";

/** Calls your own backend using its session cookie; accepts no Deva token. */
export function useDevaAI({
  endpoint = "/api/deva/chat",
}: { endpoint?: string } = {}) {
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const chat = useCallback(
    async (input: DevaChatInput): Promise<DevaChatResponse> => {
      setPending((count) => count + 1);
      setError(null);
      try {
        if (
          !endpoint.startsWith("/") ||
          endpoint.startsWith("//") ||
          endpoint.includes("\\")
        ) {
          throw new Error("Deva AI endpoint must be a same-origin path");
        }
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          redirect: "error",
          body: JSON.stringify({
            model: input.model ?? "user-default",
            messages: input.messages,
            ...(input.max_tokens === undefined
              ? {}
              : { max_tokens: input.max_tokens }),
          }),
        });
        if (!response.ok)
          throw new Error(`Chat request failed (${response.status})`);
        return (await response.json()) as DevaChatResponse;
      } catch (cause) {
        const failure =
          cause instanceof Error ? cause : new Error("Chat request failed");
        setError(failure);
        throw failure;
      } finally {
        setPending((count) => count - 1);
      }
    },
    [endpoint],
  );
  return { chat, loading: pending > 0, error };
}
