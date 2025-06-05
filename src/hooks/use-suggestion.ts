import { useSWRFetcher } from "@/lib/fetcher";
import type { PagintedPersonas } from "@/server";
import { type Envs, envToUrl } from "@/config";
import type { Suggestion, FetchSuggestionsOptions } from "@/types/suggestions";

export const useSuggestion = (env: Envs, options: FetchSuggestionsOptions = {}) => {
  const { query = "", type = "ALL" } = options;
  const url = envToUrl(env);

  const params = new URLSearchParams({
    limit: "20",
    type: type === "mention" ? "USER" : "ALL",
  });

  if (query) {
    params.set("query", query);
  }

  const {
    data: personasData,
    isLoading: isSuggestionLoading,
    error: suggestionsError,
  } = useSWRFetcher<PagintedPersonas, Error>(
    `${url}/api/sdk/persona/public?${params}`,
  );

  // Transform PublicPersona items into Suggestion format
  const suggestions: Suggestion[] = (personasData?.items ?? []).map(
    (persona) => ({
      id: persona.id,
      label: type === "mention" ? "!" : "@" + persona.username,
      content: persona.display_name ?? persona.username,
      persona: persona,
    }),
  );
  return { suggestions, isSuggestionLoading, suggestionsError };
};