import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention, { type MentionOptions } from "./extensions/mention";
import HumanMention from "./extensions/human-mention";
import { TagModelMention } from "./extensions/tag-model-mention";
import { useDevaContext } from "../../DevaContext";
import { useSuggestion } from "../../hooks/use-suggestion";

interface UseRichTextEditorProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
  onChange?: (text: string) => void;
}

export const useRichTextEditor = ({
  className = "",
  placeholder = "Write a message...",
  initialValue,
  onChange,
}: UseRichTextEditorProps) => {
  const [text, setText] = useState(initialValue || "");
  const { env } = useDevaContext();
  const [devaQuery, setDevaQuery] = useState("");
  const [humanQuery, setHumanQuery] = useState("");
  
  // Get suggestions for both mention types
  const { suggestions: devaSuggestions } = useSuggestion(env, { query: devaQuery, type: "devaResponse" });
  const { suggestions: humanSuggestions } = useSuggestion(env, { query: humanQuery, type: "mention" });

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
      Mention.configure({
        HTMLAttributes: { class: "text-[#CAF033]" },
        suggestion: {
          items: ({ query }) => {
            setDevaQuery(query);
            return devaSuggestions.map(s => ({
              id: s.id,
              label: s.content,
            }));
          },
          render: () => ({}),
        },
      }),
      HumanMention.configure({
        HTMLAttributes: { class: "text-[#f0b733]" },
        suggestion: {
          items: ({ query }) => {
            setHumanQuery(query);
            return humanSuggestions.map(s => ({
              id: s.id,
              label: s.content,
            }));
          },
          render: () => ({}),
        },
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
