import { PluginKey } from "prosemirror-state";
import { createMentionNode } from "../mention-node-factory";

export const TagModelPluginKey = new PluginKey("tag-model");

export const TagModelMention = createMentionNode({
  name: "tag-model",
  char: "#",
  pluginKey: TagModelPluginKey,
});