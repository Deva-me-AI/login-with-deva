import { useMemo } from "react";

// Match human and deva mentions only
const HIGHLIGHT_REGEX = /(?:^|\s|[^\w.])([@]{1,3}|[!#])([a-zA-Z0-9_-]+)/g;

// Keep NOTE_REGEX separate
const NOTE_REGEX = /\[\[([^\]]+?)\]\]/g;

type Note = {
  title: string;
  id: string;
};

export const replaceNoteLinks = (
  text: string,
  notes: { title: string; id: string }[],
  baseUrl = "",
): string => {
  return text.replace(NOTE_REGEX, (_match, noteContent: string) => {
    const noteObject = notes.find((note) => note.title === noteContent);
    if (noteObject) {
      return `<a href="${baseUrl}/notes/${noteObject.id}" class="deva-text-accent">${noteContent}</a>`;
    }
    return noteContent;
  });
};

export const calcLongText = (
  text: string,
  postNotes: Note[],
  baseUrl = "",
): string =>
  replaceNoteLinks(
    text.replace(
      HIGHLIGHT_REGEX,
      ` <a href="${baseUrl}/$1$2" class="deva-text-accent">$1$2</a>`,
    ),
    postNotes,
    baseUrl,
  );

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
