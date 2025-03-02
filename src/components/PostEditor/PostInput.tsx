import {
  useRemirror,
  Remirror,
  EditorComponent,
  ThemeProvider,
  useKeymap,
} from "@remirror/react";
import {
  ExtensionPriority,
  prosemirrorNodeToHtml,
  type RemirrorEventListener,
} from "remirror";
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
import { mentionMatchers, MentionSuggestor } from "./MentionSuggestor";
import { useEffect, useMemo, useCallback } from "react";

// Custom editor component with keyboard shortcuts
const CustomEditor = ({ onSubmit }: { onSubmit: () => void }) => {
  // Handle Enter key to submit
  useKeymap("Enter", () => {
    onSubmit();
    return false;
  });

  return <EditorComponent />;
};

const useExtensions = ({ placeholder }: { placeholder?: string } = {}) => {
  return useMemo(
    () => () => [
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
    ],
    [placeholder],
  );
};

export function PostInput({
  id,
  value,
  placeholder,
  postId,
  onChange: externalOnChange,
  onSubmit,
}: {
  value: string;
  id: string;
  placeholder: string;
  postId: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}) {
  const extensions = useExtensions({
    placeholder,
  });

  const {
    manager,
    state,
    onChange: remirrorOnChange,
  } = useRemirror({
    extensions,
    content: value,
    selection: "end",
    stringHandler: "html",
  });

  // Handle both internal and external onChange events
  const handleChange: RemirrorEventListener<Remirror.Extensions> = useCallback(
    (state) => {
      remirrorOnChange(state);
      // Get the HTML content from the editor state
      externalOnChange(prosemirrorNodeToHtml(state.state.doc));
    },
    [externalOnChange, remirrorOnChange],
  );

  // Only update content if the postId changes (meaning it's a different post)
  useEffect(() => {
    if (!manager || !postId) return;

    manager.view.updateState(
      manager.createState({
        content: value,
        selection: "start",
        stringHandler: "html",
      }),
    );
  }, [postId, manager]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider>
      <Remirror
        manager={manager}
        state={state}
        onChange={handleChange}
        classNames={["!p-1"]}
      >
        <CustomEditor onSubmit={onSubmit} />
        <MentionSuggestor />
      </Remirror>
    </ThemeProvider>
  );
}
