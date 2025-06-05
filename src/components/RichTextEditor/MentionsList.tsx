import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { Suggestion } from "@/types/suggestions";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const Chip = ({
  children,
  className,
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) => (
  <Badge variant="secondary" className={className}>
    {children}
  </Badge>
);

interface Props {
  items: Suggestion[];
  loading: false;
  human?: boolean;
  command: ({ id }: { id: string }) => void;
}

export const MentionsList = forwardRef(function MentionList(
  { items, command, loading, human }: Props,
  ref,
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index]?.persona?.username;

    if (item) {
      command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    document
      .getElementById(
        `item${(selectedIndex + items.length - 1) % items.length}`,
      )
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const downHandler = () => {
    if (selectedIndex + 1 >= items.length) {
      // scroll to bottom
      // this will trigger the handleScroll function to fetch more items
      const scrollHeight = document.getElementById(
        "mention-suggestion-items",
      )?.scrollHeight;
      if (scrollHeight) {
        document
          .getElementById("mention-suggestion-items")
          ?.scrollTo(0, scrollHeight);
      }
    } else setSelectedIndex((selectedIndex + 1) % items.length);
    document
      .getElementById(`item${selectedIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        if (selectedIndex === -1) {
          return false;
        }

        // NOTE: this is to prevent enter from sending the message. it's a
        // collision in enter behavior. we need enter to select the current item
        // in the auto complete list rather than submit the message
        event.preventDefault();
        event.stopPropagation();
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <div
      className={"mention-suggestion-container max-h-[19rem] hide-scrollbar"}
    >
      <div
        data-testid="MentionList"
        id="mention-suggestion-items"
        className={cn("max-h-[19rem] overflow-y-scroll", "hide-scrollbar")}
      >
        {items.map((suggestion: Suggestion, index) => {
          const displayName =
            suggestion.persona.display_name || suggestion.persona.username;

          return (
            <button
              // aria label used for testing
              aria-label={suggestion.persona.username}
              className={`mention-suggestion-item ${
                index === selectedIndex ? "is-selected" : ""
              }`}
              key={suggestion.id + index}
              onClick={() => selectItem(index)}
              id={`item${index}`}
              onMouseEnter={() => {
                setSelectedIndex(index);
              }}
              onMouseLeave={() => {
                setSelectedIndex(-1);
              }}
            >
              <div className="flex flex-row gap-2 items-center overflow-hidden">
                <img
                  src={suggestion.persona.avatar || "/icons/profile.svg"}
                  alt="Deva AI Agents Platform pfp"
                  className="w-9 h-9 rounded-full"
                />
                <div className="flex flex-col gap-1 max-w-full w-full">
                  <div className="flex items-center flex-nowrap">
                    <div className="flex overflow-hidden text-ellipsis whitespace-nowrap">
                      {displayName}
                    </div>
                    {suggestion.persona.user_id ? "🫶" : "🤖"}
                  </div>
                  <div className="text-lynch-600 text-sm flex items-center justify-between w-full">
                    {/* NOTE: Exclamation marks imply human devas */}
                    {/* {suggestion.personas?.[0]?.devaId || chat ? "@" : "!"} */}
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]">
                      {human ? "!" : "@"}
                      {suggestion.persona.username}
                    </span>
                    <div className="flex">
                      <Chip color="neutral">
                        <div className="flex flex-nowrap whitespace-nowrap">
                          Lvl{" "}
                          {human
                            ? suggestion.persona.user_level
                            : suggestion.persona.deva_level}
                        </div>
                      </Chip>
                      {!human && (
                        <Chip color="jewel" className="ml-[5px]">
                          <div className="flex flex-nowrap whitespace-nowrap">
                            ₭{" "}
                            {Math.round(
                              Number(
                                suggestion.persona
                                  .creator_inference_cost_multiplier,
                              ) * 100,
                            )}
                            %
                          </div>
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {!items.length && !loading ? (
          <div className="flex items-center justify-center w-full px-4 py-2 text-[#707583]">
            {"No results..."}
          </div>
        ) : null}
      </div>
      {loading && (
        <div className="flex items-center justify-center w-full py-3">
          <Spinner />
        </div>
      )}
    </div>
  );
});
