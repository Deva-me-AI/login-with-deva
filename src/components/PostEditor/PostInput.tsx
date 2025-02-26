"use client";

import * as React from "react";
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

const useExtensions = ({ placeholder }: { placeholder?: string } = {}) => {
  return React.useMemo(
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

export function PostInput() {
  const { manager } = useRemirror({
    extensions: useExtensions({ placeholder: "Type '@' to mention someone" }),
    content: "",
    selection: "end",
    stringHandler: "html",
  });

  return (
    <ThemeProvider>
      <Remirror manager={manager}>
        <EditorComponent />
        <MentionSuggestor />
      </Remirror>
    </ThemeProvider>
  );
}
