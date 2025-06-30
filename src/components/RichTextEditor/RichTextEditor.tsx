import { EditorContent } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

import { useRichTextEditor } from "./useRichTextEditor";
import { useIsVirtualKeyboardOpen } from "../../hooks/use-virtual-keyboard-open";

interface IRichTextEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (text?: string) => void;
  disableSubmit?: boolean;
  // PostInput compatibility props
  id: string;
  postId?: string;
  className?: string;
}

export const RichTextEditor = ({
  value = "",
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
    setValue: setText,
  } = useRichTextEditor({
    id,
    initialValue: value,
    className: className ?? 
      "m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-7 pl-3 focus:ring-0 focus-visible:ring-0 dark:bg-transparent",
    placeholder,
    onChange,
  });

  const { isVirtualKeyboardOpen } = useIsVirtualKeyboardOpen();
  const postIdRef = useRef(postId);

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
    if (postId && editor && postIdRef.current !== postId) {
      editor.commands.setContent(value || "");
      postIdRef.current = postId;
    }
  }, [postId, editor, value]);

  return (
    <EditorContent
      id={id}
      editor={editor}
      onKeyDown={handleOnSubmit}
      className="deva-h-full deva-w-full"
    />
  );
};
