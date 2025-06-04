import { PluginKey } from "prosemirror-state";
import { createMentionNode } from "../mention-node-factory";

export const NoteMentionPluginKey = new PluginKey("note-mention");

export const NoteMention = createMentionNode({
  name: "note-mention",
  char: "[[",
  pluginKey: NoteMentionPluginKey,
  renderLabelSuffix: "]]",
});