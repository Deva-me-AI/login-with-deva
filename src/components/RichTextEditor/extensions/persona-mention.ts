import { type SuggestionOptions } from "@tiptap/suggestion";
import { type Node as ProseMirrorNode } from "prosemirror-model";
import { PluginKey } from "prosemirror-state";
import { createMentionNode } from "../mention-node-factory";

export type PersonaMentionOptions = {
  HTMLAttributes: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  renderLabel: (props: {
    options: PersonaMentionOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const PersonaMentionPluginKey = new PluginKey("mention");

export const PersonaMention = createMentionNode({
  name: "mention",
  char: "@",
  pluginKey: PersonaMentionPluginKey,
});

