import { useSWRFetcher } from "@/lib/fetcher";
import type { PagintedPersonas, PublicPersona } from "@/server";
import { type Envs, envToUrl } from "@/config";

export type Suggestion = {
  id: string;
  // used by remirror as the text inside the mention and eventually bubbles up
  // to our notes editor in getMentions
  label: string;
  // used to display the suggestion in the dropdown
  // we use this to add context to the menu, although label is used internally
  // by remirror
  content: string;
  // used by remirror to determine how much of the text to replace with the suggestion
  // use partial to split the mention at the cursor and preserve the text after the cursor
  // replacing the content before the cursor by label
  replacementType?: "full" | "partial";
  persona: PublicPersona;
};

interface SuggestionOptions {
  query?: string;
  type?: "mention" | "devaResponse";
}

export const useSuggestion = (env: Envs, options: SuggestionOptions = {}) => {
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