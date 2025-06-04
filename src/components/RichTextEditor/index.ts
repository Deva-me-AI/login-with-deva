export { RichTextEditor } from './RichTextEditor';
export { useRichTextEditor } from './useRichTextEditor';
export { createMentionNode } from './mention-node-factory';
export type { BaseMentionOptions } from './mention-node-factory';

// Extension exports
export { Mention, MentionPluginKey } from './extensions/mention';
export type { MentionOptions } from './extensions/mention';
export { HumanMention, HumanMentionPluginKey } from './extensions/human-mention';
export type { HumanMentionOptions } from './extensions/human-mention';
export { TagModelMention, TagModelPluginKey } from './extensions/tag-model-mention';
export { NoteMention, NoteMentionPluginKey } from './extensions/note-mention';
