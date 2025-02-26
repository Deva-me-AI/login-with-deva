"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { AtSign, Hash, AlertCircle } from "lucide-react";
import {
  useRemirror,
  useChainedCommands,
  useCurrentSelection,
  useActive,
  useAttrs,
  Remirror,
  EditorComponent,
  FloatingWrapper,
} from "@remirror/react";
import { ExtensionPriority } from "remirror";
import {
  BoldExtension,
  MentionAtomExtension,
  PlaceholderExtension,
  ItalicExtension,
  LinkExtension,
  HeadingExtension,
  UnderlineExtension,
  HardBreakExtension,
  HorizontalRuleExtension,
  BlockquoteExtension,
  BulletListExtension,
  OrderedListExtension,
  ListItemExtension,
  CodeBlockExtension,
  CodeExtension,
  MarkdownExtension,
  TaskListExtension,
} from "remirror/extensions";
import { mentionMatchers } from "./MentionSuggestor";

interface MentionInputProps {
  className?: string;
}

interface Suggestion {
  id: string;
  name: string;
  handle: string;
  type: "user" | "tag" | "alert";
  icon?: React.ReactNode;
  label: string;
}

// Example data - in real app, this would be filtered based on trigger char
const SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    name: "John Doe",
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

const useExtensions =
  ({ placeholder }: { placeholder?: string } = {}) =>
  () => [
    new MentionAtomExtension({
      matchers: mentionMatchers,
      appendText: " ",
    }),
    new BoldExtension({}),
    new ItalicExtension({}),
    new LinkExtension({ autoLink: true }),
    new HeadingExtension({}),
    new UnderlineExtension({}),
    new HardBreakExtension({}),
    new HorizontalRuleExtension({}),
    new BlockquoteExtension({}),
    new BulletListExtension({ enableSpine: true }),
    new OrderedListExtension({}),
    new ListItemExtension({
      priority: ExtensionPriority.High,
      enableCollapsible: true,
    }),
    new CodeBlockExtension({}),
    new CodeExtension({}),
    new MarkdownExtension({}),
    new TaskListExtension({}),
    new PlaceholderExtension({ placeholder: placeholder }),
  ];

export function MentionInput({ className }: MentionInputProps) {
  const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const chain = useChainedCommands();

  const mentionExtension = React.useMemo(
    () =>
      new MentionAtomExtension({
        matchers: [
          {
            name: "deva",
            char: "@",
            matchOffset: 0,
          },
          {
            name: "tag",
            char: "#",
            matchOffset: 0,
          },
          {
            name: "user",
            char: "!",
            matchOffset: 0,
          },
        ],
        extraAttributes: {
          type: { default: "user" },
          handle: { default: "" },
        },
      }),
    [],
  );

  const placeholderExtension = React.useMemo(
    () =>
      new PlaceholderExtension({
        placeholder: "What's on your mind? Use @, #, or ! to mention",
      }),
    [],
  );

  const { manager } = useRemirror({
    extensions: () => [mentionExtension, placeholderExtension],
    content: "",
    selection: "end",
    stringHandler: "html",
  });

  return (
    <Remirror manager={manager}>
      <EditorComponent />
      <MentionPopupWrapper
        className={className}
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
                        chain
                          ?.insertMention({
                            id: suggestion.id,
                            label: suggestion.label,
                            type: suggestion.type,
                            handle: suggestion.handle,
                          })
                          .focus()
                          .run();
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
    </Remirror>
  );
}

interface MentionPopupWrapperProps {
  children: React.ReactNode;
  className?: string;
  setPopupPosition: (position: { top: number; left: number }) => void;
  setShowPopup: (show: boolean) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setSearchTerm: (term: string) => void;
}

const MentionPopupWrapper: React.FC<MentionPopupWrapperProps> = ({
  children,
  className,
  setPopupPosition,
  setShowPopup,
  setSuggestions,
  setSearchTerm,
}) => {
  const { selection } = useCurrentSelection();
  const active = useActive();
  const attrs = useAttrs();

  React.useEffect(() => {
    if (!selection) return;

    const suggestionActive = active.suggestion();
    if (!suggestionActive) {
      setShowPopup(false);
      return;
    }

    const suggestionAttrs = attrs.suggestion();
    if (!suggestionAttrs) return;

    const { query, text, coordinates } = suggestionAttrs;

    if (coordinates) {
      setPopupPosition(coordinates);
    }

    setSearchTerm(query ?? "");
    setSuggestions(getSuggestionItems(query ?? ""));
    setShowPopup(true);
  }, [
    selection,
    active,
    attrs,
    setPopupPosition,
    setShowPopup,
    setSuggestions,
    setSearchTerm,
  ]);

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
