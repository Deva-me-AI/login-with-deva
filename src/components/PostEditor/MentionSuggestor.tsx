import { cn } from "@/lib/utils";
import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import type { MentionAtomExtensionMatcher } from "remirror/extensions";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDevaContext } from "@/DevaContext";
import { useSuggestion, type Suggestion } from "@/hooks/use-suggestion";


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


export const MentionSuggestor = ({
  onMentionOpen,
}: {
  onMentionOpen: (state: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"mention" | "devaResponse">("mention");
  const { env } = useDevaContext();
  const { suggestions } = useSuggestion(env, { query, type });

  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({ items: suggestions, replacementType: "full" });

  useEffect(() => {
    onMentionOpen(!!state);

    if (!state) {
      return;
    }

    setQuery(state.query.full);
    setType(state.text.full.startsWith("@") ? "devaResponse" : "mention");
  }, [state, onMentionOpen]);

  if (!state) {
    return null;
  }

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={true}
      placement="bottom-start"
      containerClass="deva-z-50"
      renderOutsideEditor={true}
    >
      <div
        {...getMenuProps()}
        className="deva-min-w-[180px] deva-rounded-md deva-border deva-border-zinc-800 deva-bg-zinc-950 deva-shadow-md"
      >
        {suggestions.length === 0 ? (
          <div className="deva-px-2 deva-py-1.5 deva-text-sm deva-text-zinc-500 dark:deva-text-zinc-400">
            No results found
          </div>
        ) : (
          <div className="deva-py-1">
            {suggestions.map((item, index) => (
              <div
                key={item.id}
                {...getItemProps({ item, index })}
                className={cn(
                  "deva-flex deva-items-center deva-gap-2 deva-p-2 deva-text-sm",
                  (indexIsHovered(index) || indexIsSelected(index)) &&
                    "deva-cursor-pointer deva-bg-zinc-800",
                )}
              >
                <div className="">
                  <Avatar className="deva-h-10 deva-w-10">
                    <AvatarImage src={item.persona?.avatar ?? ""} alt="" />
                    <AvatarFallback className="deva-text-black">
                      {item.label.slice(0, 1)?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="deva-flex deva-flex-col">
                  <div>
                    {item.persona.display_name ?? item.persona.username}
                  </div>
                  <div>
                    {type === "mention" ? "!" : "@"}
                    {item.persona.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FloatingWrapper>
  );
};
