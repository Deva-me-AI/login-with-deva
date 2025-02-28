"use client";
import "remirror/styles/all.css";
import {
  useRemirror,
  Remirror,
  EditorComponent,
  ThemeProvider,
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
import { mentionMatchers, MentionSuggestor } from "./MentionSuggestor";
import { useEffect, useMemo } from "react";

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
}: {
  value: string;
  id: string;
  placeholder: string;
}) {
  const extensions = useExtensions({
    placeholder,
  });

  const { manager, state, onChange } = useRemirror({
    extensions,
    content: value,
    selection: "end",
    stringHandler: "html",
  });

  // Only update content if the id changes (meaning it's a different post)
  useEffect(() => {
    if (!manager || !id) return;

    manager.view.updateState(
      manager.createState({
        content: value,
        selection: "start",
        stringHandler: "html",
      }),
    );
  }, [id, manager]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider>
      <Remirror manager={manager} state={state} onChange={onChange} classNames={["!p-1"]}> 
        <EditorComponent />
        <MentionSuggestor />
      </Remirror>
    </ThemeProvider>
  );
}
