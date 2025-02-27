import { cn } from "@/lib/utils";
import { AtSign, Hash, AlertCircle } from "lucide-react";
import { FloatingWrapper } from "@remirror/react";
import type { MentionAtomExtensionMatcher } from "remirror/extensions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
    handle: "johndoe",
    type: "user",
    icon: <AtSign className="h-4 w-4" />,
    label: "@johndoe",
  },
  {
    id: "2",
    name: "Jane Smith",
    handle: "janesmith",
    type: "user",
    icon: <AtSign className="h-4 w-4" />,
    label: "@janesmith",
  },
  {
    id: "3",
    name: "Important",
    handle: "important",
    type: "alert",
    icon: <AlertCircle className="h-4 w-4" />,
    label: "!important",
  },
  {
    id: "4",
    name: "Announcement",
    handle: "announcement",
    type: "tag",
    icon: <Hash className="h-4 w-4" />,
    label: "#announcement",
  },
];

const getSuggestionItems = (query: string) => {
  return SUGGESTIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.handle.toLowerCase().includes(query.toLowerCase()),
  );
};

export const mentionMatchers = [
  {
    name: "personalBacklink" as const,
    char: /(;|\[\[)/g, // This is a regex that matches either a semicolon or double brackets
    matchOffset: 0,
    supportedCharacters: /[^;\n\r]+/, // don't allow semicolons or newlines
  },
  {
    name: "othersBacklink" as const,
    char: "!->",
    matchOffset: 0,
    supportedCharacters: /[^;]+/,
  },
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
  {
    name: "noteLink" as const,
    char: "[[",
    matchOffset: 0,
    supportedCharacters: /[^\]]+/,
  },
] satisfies MentionAtomExtensionMatcher[];

export const MentionSuggestor = () => {
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <MentionPopupWrapper
      setPopupPosition={setPopupPosition}
      setShowPopup={setShowPopup}
      setSuggestions={setSuggestions}
      setSearchTerm={setSearchTerm}
    >
      {showPopup && (
        <div
          className="absolute z-50"
          style={{
            top: popupPosition.top + 24,
            left: popupPosition.left,
          }}
        >
          <Command className="w-[200px] border shadow-md">
            <CommandInput placeholder="Search..." value={searchTerm} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.handle}
                    onSelect={() => {
                      setShowPopup(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {suggestion.icon}
                      <span>{suggestion.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </MentionPopupWrapper>
  );
};

interface MentionPopupWrapperProps {
  children: React.ReactNode;
  className?: string;
  setPopupPosition: (position: { top: number; left: number }) => void;
  setShowPopup: (show: boolean) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setSearchTerm: (term: string) => void;
}

const MentionPopupWrapper = ({
  children,
  className,
  setPopupPosition,
  setShowPopup,
  setSuggestions,
  setSearchTerm,
}: MentionPopupWrapperProps) => {
  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={true}
      placement="bottom-start"
      containerClass="z-50"
    >
      <div
        className={cn("prose prose-sm relative w-full max-w-none", className)}
      >
        <div className="min-h-[100px] rounded-md border p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {children}
        </div>
      </div>
    </FloatingWrapper>
  );
};
