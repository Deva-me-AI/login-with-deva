import { type Envs, envToUrl } from "@/config";
import type { PagintedPersonas } from "@/server";
import type { Suggestion, FetchSuggestionsOptions } from "@/types/suggestions";

export async function fetchSuggestions(
  env: Envs,
  options: FetchSuggestionsOptions = {}
): Promise<Suggestion[]> {
  const { query = "", type = "ALL", limit = 20 } = options;
  const url = envToUrl(env);

  const params = new URLSearchParams({
    limit: limit.toString(),
    type: type === "mention" ? "USER" : "ALL",
  });

  if (query) {
    params.set("query", query);
  }

  try {
    const response = await fetch(`${url}/api/sdk/persona/public?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
    }

    const personasData = await response.json() as PagintedPersonas;

    // Transform PublicPersona items into Suggestion format
    const suggestions: Suggestion[] = (personasData?.items ?? []).map(
      (persona) => ({
        id: persona.id,
        label: type === "mention" ? "!" : "@" + persona.username,
        content: persona.display_name ?? persona.username,
        persona: persona,
      })
    );

    return suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
}