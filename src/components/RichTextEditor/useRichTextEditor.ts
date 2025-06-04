import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention, { type MentionOptions } from "./extensions/mention";
import HumanMention from "./extensions/human-mention";
import { TagModelMention } from "./extensions/tag-model-mention";
import { NoteMention } from "./extensions/note-mention";

interface UseRichTextEditorProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onChange?: (text: string) => void;
  mentionConfig?: {
    deva?: MentionOptions["suggestion"];
    human?: MentionOptions["suggestion"];
    tagModel?: MentionOptions["suggestion"];
    note?: MentionOptions["suggestion"];
  };
}

export const useRichTextEditor = ({
  className = "",
  placeholder = "Write a message...",
  initialValue,
  onChange,
  mentionConfig,
}: UseRichTextEditorProps) => {
  const [text, setText] = useState(initialValue || "");

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: className,
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: false,
        italic: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        strike: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: () => placeholder,
        emptyNodeClass: "text-placeholder-editor text-sm",
      }),
      ...(mentionConfig?.deva ? [Mention.configure({
        HTMLAttributes: { class: "text-[#CAF033]" },
        suggestion: mentionConfig.deva,
      })] : []),
      ...(mentionConfig?.human ? [HumanMention.configure({
        HTMLAttributes: { class: "text-[#f0b733]" },
        suggestion: mentionConfig.human,
      })] : []),
      ...(mentionConfig?.tagModel ? [TagModelMention.configure({
        HTMLAttributes: { class: "text-[#f0b733]" },
        suggestion: mentionConfig.tagModel,
      })] : []),
      ...(mentionConfig?.note ? [NoteMention.configure({
        HTMLAttributes: { class: "text-[#CAF033]" },
        suggestion: mentionConfig.note,
      })] : []),
    ],
    onUpdate: ({ editor }) => {
      const postText = editor.getText().toString();
      setText(postText);
      if (onChange) onChange(postText);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (text === editor.getText()) return;

    editor?.commands.setContent(text);
  }, [editor, text]);


  return {
    editor,
    value: text,
    setValue: setText,
  };
};
