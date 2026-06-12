import { useMemo } from "react";
import {
  linkMentionsForMarkdown,
  type MarkdownNote,
  replaceNoteLinksForMarkdown,
} from "@/lib/markdown-format";

type Note = MarkdownNote;

export const replaceNoteLinks = (
  text: string,
  notes: { title: string; id: string }[],
  baseUrl = "",
): string => {
  return replaceNoteLinksForMarkdown(text, notes, baseUrl);
};

export const calcLongText = (
  text: string,
  postNotes: Note[],
  baseUrl = "",
): string =>
  replaceNoteLinks(linkMentionsForMarkdown(text, baseUrl), postNotes, baseUrl);

export const calcShortText = (
  text: string,
  postNotes: Note[],
  baseUrl = "",
): string => {
  return calcLongText(
    text.length > 280
      ? text.substring(0, 260) + "..." // show less than condition to ensure there is something to show
      : text.split("\n\n").length > 5
        ? text.split("\n\n").slice(0, 4).join("\n\n") + "..."
        : text,
    postNotes,
    baseUrl,
  );
};

interface UseFormattedTextOptions {
  text: string;
  notes?: Note[];
  baseUrl?: string;
  truncate?: boolean;
}

/**
 * Hook that processes text with mentions and note links
 * @param options Configuration options
 * @returns Formatted text with links
 */
export function useFormattedText({
  text,
  notes = [],
  baseUrl = "",
}: UseFormattedTextOptions): string {
  return useMemo(() => {
    if (!text) return "";

    return calcShortText(text, notes, baseUrl);
  }, [text, notes, baseUrl]);
}
