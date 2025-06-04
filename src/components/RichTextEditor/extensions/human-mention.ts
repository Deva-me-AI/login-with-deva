import { SuggestionOptions } from "@tiptap/suggestion";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { PluginKey } from "prosemirror-state";
import { createMentionNode } from "../mention-node-factory";

export type HumanMentionOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: HumanMentionOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const HumanMentionPluginKey = new PluginKey("humanMention");

export const HumanMention = createMentionNode({
  name: "humanMention",
  char: "!",
  pluginKey: HumanMentionPluginKey,
});

export default HumanMention;