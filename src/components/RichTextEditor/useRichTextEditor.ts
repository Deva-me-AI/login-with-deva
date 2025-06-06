import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { PersonaMention } from "./extensions/persona-mention";
import { HumanMention } from "./extensions/human-mention";
import { TagModelMention } from "./extensions/tag-model-mention";
import usePersonaSuggester from "./use-persona-suggestor";
import { useDevaContext } from "@/DevaContext";

interface UseRichTextEditorProps {
  id: string;
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onChange?: (text: string) => void;
}

export const useRichTextEditor = ({
  id,
  className = "",
  placeholder = "Write a message...",
  initialValue,
  onChange,
}: UseRichTextEditorProps) => {
  const [text, setText] = useState(initialValue || "");
  const { env } = useDevaContext();

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
      PersonaMention.configure({
        HTMLAttributes: { class: "text-[#CAF033]" },
        suggestion: usePersonaSuggester(id, env, "deva"),
      }),
      HumanMention.configure({
        HTMLAttributes: { class: "text-[#f0b733]" },
        suggestion: usePersonaSuggester(id, env, "human"),
      }),
      TagModelMention.configure({
        HTMLAttributes: { class: "text-[#f0b733]" },
        suggestion: undefined,
      }),
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
