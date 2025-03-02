import { cn } from "@/lib/utils";
import { AtSign, Hash, AlertCircle } from "lucide-react";
import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import type { MentionAtomExtensionMatcher } from "remirror/extensions";
import { useSWRFetcher } from "@/lib/fetcher";
import type { PagintedPersonas } from "@/server";
import { type Envs, envToUrl } from "@/config";
import { useDeva } from "@/use-deva";
import { useEffect, useState } from "react";

type Suggestion = {
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
};

type MentionTypes = "mention" | "devaResponse";

export const mentionMatchers = [
  {
    name: "mention" as MentionTypes, // Humans
    char: "!",
    matchOffset: 0,
    supportedCharacters: /[^!]+/,
  },
  {
    name: "devaResponse" as MentionTypes, // Devas
    char: "@",
    matchOffset: 0,
    supportedCharacters: /[^@]+/,
  },
] satisfies MentionAtomExtensionMatcher[];

interface SuggestionOptions {
  query?: string;
  type?: "mention" | "devaResponse";
}

const useSuggestion = (env: Envs, options: SuggestionOptions = {}) => {
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
      label: persona.username,
      content: persona.display_name ?? persona.username,
    }),
  );
  return { suggestions, isSuggestionLoading, suggestionsError };
};

export const MentionSuggestor = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"mention" | "devaResponse">("mention");
  const { env } = useDeva();
  const { suggestions } = useSuggestion(env, { query, type });

  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({ items: suggestions, replacementType: "full" });

  useEffect(() => {
    if (!state) {
      return;
    }
    setQuery(state.query.full);
    setType(state.text.full.startsWith("@") ? "devaResponse" : "mention");
  }, [state]);

  if (!state) {
    return null;
  }

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={true}
      placement="bottom-start"
      containerClass="z-50"
      renderOutsideEditor={true}
    >
      <div
        {...getMenuProps()}
        className="min-w-[180px] rounded-md border border-zinc-800 bg-white bg-zinc-950 shadow-md"
      >
        {suggestions.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            No results found
          </div>
        ) : (
          <div className="py-1">
            {suggestions.map((item, index) => (
              <div
                key={item.id}
                {...getItemProps({ item, index })}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm",
                  (indexIsHovered(index) || indexIsSelected(index)) &&
                    "cursor-pointer bg-zinc-800",
                )}
              >
                {item.label.startsWith("@") && (
                  <AtSign className="h-4 w-4 text-zinc-500" />
                )}
                {item.label.startsWith("!") && (
                  <AlertCircle className="h-4 w-4 text-zinc-500" />
                )}
                {item.label.startsWith("#") && (
                  <Hash className="h-4 w-4 text-zinc-500" />
                )}
                <span>{item.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FloatingWrapper>
  );
};
