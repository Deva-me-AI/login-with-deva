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
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

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
      id="mention-suggestion-container"
      className={"deva-hide-scrollbar deva-max-h-[19rem]"}
    >
      <div
        id="mention-suggestion-items"
        className={cn(
          "deva-hide-scrollbar deva-max-h-[19rem] deva-overflow-y-scroll",
        )}
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
              key={suggestion.id}
              onClick={() => selectItem(index)}
              onMouseEnter={() => {
                setSelectedIndex(index);
              }}
              onMouseLeave={() => {
                setSelectedIndex(-1);
              }}
            >
              <div className="deva-flex deva-flex-row deva-items-center deva-gap-2 deva-overflow-hidden">
                <Avatar className="deva-h-9 deva-w-9 deva-rounded-full">
                  <AvatarImage
                    src={suggestion.persona.avatar || "/icons/profile.svg"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {suggestion.persona.display_name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="deva-flex deva-w-full deva-max-w-full deva-flex-col deva-gap-1">
                  <div className="deva-flex deva-flex-nowrap deva-items-center">
                    <div className="deva-flex deva-overflow-hidden deva-text-ellipsis deva-whitespace-nowrap">
                      {displayName}
                    </div>
                    {suggestion.persona.user_id ? "🫶" : "🤖"}
                  </div>
                  <div className="deva-text-lynch-600 deva-flex deva-w-full deva-items-center deva-justify-between deva-text-sm">
                    {/* NOTE: Exclamation marks imply human devas */}
                    <span className="deva-max-w-[10rem] deva-overflow-hidden deva-text-ellipsis deva-whitespace-nowrap">
                      {human ? "!" : "@"}
                      {suggestion.persona.username}
                    </span>
                    <div className="deva-flex">
                      <Chip color="neutral">
                        <div className="deva-flex deva-flex-nowrap deva-whitespace-nowrap">
                          Lvl{" "}
                          {human
                            ? suggestion.persona.user_level
                            : suggestion.persona.deva_level}
                        </div>
                      </Chip>
                      {!human && (
                        <Chip color="jewel" className="deva-ml-[5px]">
                          <div className="deva-flex deva-flex-nowrap deva-whitespace-nowrap">
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
          <div className="deva-flex deva-w-full deva-items-center deva-justify-center deva-px-4 deva-py-2 deva-text-[#707583]">
            {"No results..."}
          </div>
        ) : null}
      </div>
      {loading && (
        <div className="deva-flex deva-w-full deva-items-center deva-justify-center deva-py-3">
          <Spinner />
        </div>
      )}
    </div>
  );
});
