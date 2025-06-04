import { SuggestionOptions } from "@tiptap/suggestion";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { PluginKey } from "prosemirror-state";
import { createMentionNode } from "../mention-node-factory";

export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: MentionOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const MentionPluginKey = new PluginKey("mention");

export const Mention = createMentionNode({
  name: "mention",
  char: "@",
  pluginKey: MentionPluginKey,
});

export default Mention;