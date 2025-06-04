import { EditorContent } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { useCallback, useEffect, KeyboardEvent } from "react";

import { useRichTextEditor } from "./useRichTextEditor";
import { useIsVirtualKeyboardOpen } from "../../hooks/use-virtual-keyboard-open";

interface IRichTextEditorProps {
  value?: string;
  suggestioner?: Omit<SuggestionOptions<any>, "editor">;
  humansSuggestioner?: Omit<SuggestionOptions<any>, "editor">;
  tagModelSuggestioner?: Omit<SuggestionOptions<any>, "editor">;
  noteSuggester?: Omit<SuggestionOptions<any>, "editor">;
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (text?: string) => void;
  disableSubmit?: boolean;
  // PostInput compatibility props
  id?: string;
  postId?: string;
  className?: string;
}

export const RichTextEditor = ({
  value = "",
  suggestioner,
  humansSuggestioner,
  tagModelSuggestioner,
  noteSuggester,
  onChange,
  onSubmit,
  placeholder = "Write a message...",
  disableSubmit = false,
  id,
  postId,
  className,
}: IRichTextEditorProps) => {
  const {
    editor,
    value: text,
    setValue: setText,
  } = useRichTextEditor({
    initialValue: value,
    className: className || 
      "m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-7 pl-3 focus:ring-0 focus-visible:ring-0 dark:bg-transparent",
    placeholder,
    onChange,
    mentionConfig: suggestioner || humansSuggestioner || tagModelSuggestioner || noteSuggester ? {
      deva: suggestioner,
      human: humansSuggestioner,
      tagModel: tagModelSuggestioner,
      note: noteSuggester,
    } : undefined,
  });

  const { isVirtualKeyboardOpen } = useIsVirtualKeyboardOpen();

  const handleOnSubmit = useCallback((e: KeyboardEvent) => {
    if (!isVirtualKeyboardOpen && e.key === "Enter" && !e.shiftKey && !disableSubmit) {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    }
  }, [disableSubmit, isVirtualKeyboardOpen, onSubmit]);

  useEffect(() => {
    if(!value?.length) {
      setText('')
    }
  }, [setText, value]);

  // Handle postId changes - reset content when postId changes (new post)
  useEffect(() => {
    if (postId && editor) {
      editor.commands.setContent(value || "");
    }
  }, [postId, editor, value]);

  return (
    <EditorContent
      id={id}
      editor={editor}
      onKeyDown={handleOnSubmit}
    />
  );
};
