import { cn } from "@/lib/utils";
import { AtSign, Hash, AlertCircle } from "lucide-react";
import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import type { MentionAtomExtensionMatcher } from "remirror/extensions";
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

// Example data - in real app, this would be filtered based on trigger char
const SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    label: "johndoe",
    content: "John Doe (@johndoe)",
    replacementType: "partial",
  },
  {
    id: "2",
    label: "janesmith",
    content: "Jane Smith (@janesmith)",
    replacementType: "partial",
  },
  {
    id: "3",
    label: "important",
    content: "Important Alert",
    replacementType: "full",
  },
  {
    id: "4",
    label: "#announcement",
    content: "Announcement Tag",
    replacementType: "full",
  },
];

const getSuggestionItems = (query: string) => {
  return SUGGESTIONS.filter(
    (item) =>
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const mentionMatchers = [
  {
    name: "mention" as const, // Humans
    char: "!",
    matchOffset: 0,
    supportedCharacters: /[^!]+/,
  },
  {
    name: "devaResponse" as const, // Devas
    char: "@",
    matchOffset: 0,
    supportedCharacters: /[^@]+/,
  },
] satisfies MentionAtomExtensionMatcher[];

const useSuggestion = (query: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions(getSuggestionItems(query));
  }, [query]);

  return { suggestions };
};

export const MentionSuggestor = () => {
  const { suggestions } = useSuggestion("");

  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({ items: suggestions, replacementType: "full" });

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
        className="min-w-[180px] rounded-md border bg-white shadow-md border-zinc-800 bg-zinc-950"
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
