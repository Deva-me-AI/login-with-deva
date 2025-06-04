import { EditorContent } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { useCallback, useEffect, KeyboardEvent } from "react";

import { useRichTextEditor } from "./useRichTextEditor";
import { useIsVirtualKeyboardOpen } from "../../hooks/use-virtual-keyboard-open";

interface IRichTextboxProps {
  value?: string;
  suggestioner: Omit<SuggestionOptions<any>, "editor">;
  humansSuggestioner: Omit<SuggestionOptions<any>, "editor">;
  tagModelSuggestioner: Omit<SuggestionOptions<any>, "editor">;
  noteSuggester: Omit<SuggestionOptions<any>, "editor">;
  placeholder?: string;
  onChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
  disableSubmit: boolean;
}

const RichTextbox = ({
  value = "",
  suggestioner,
  humansSuggestioner,
  tagModelSuggestioner,
  noteSuggester,
  onChange,
  onSubmit,
  placeholder = "Write a message...",
  disableSubmit,
}: IRichTextboxProps) => {
  const {
    editor,
    value: text,
    setValue: setText,
  } = useRichTextEditor({
    initialValue: value,
    className:
      "m-0 outline-none w-full resize-none border-0 bg-transparent p-0 pr-7 pl-3 focus:ring-0 focus-visible:ring-0 dark:bg-transparent",
    placeholder,
    onChange,
    mentionConfig: {
      deva: suggestioner,
      human: humansSuggestioner,
      tagModel: tagModelSuggestioner,
      note: noteSuggester,
    },
  });

  const { isVirtualKeyboardOpen } = useIsVirtualKeyboardOpen();

  const handleOnSubmit = useCallback((e: KeyboardEvent) => {
    if (!isVirtualKeyboardOpen && e.key === "Enter" && !e.shiftKey && !disableSubmit) {
      if (onSubmit) {
        onSubmit(text);
      }
    }
  }, [disableSubmit, isVirtualKeyboardOpen, onSubmit, text]);

  useEffect(() => {
    if(!value?.length) {
      setText('')
    }
  }, [setText, value]);

  return (
    <EditorContent
      editor={editor}
      onKeyDown={handleOnSubmit}
    />
  );
};

export default RichTextbox;
