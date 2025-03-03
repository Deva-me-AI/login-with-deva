// Match human and deva mentions only
export const HIGHLIGHT_REGEX =
  /(?:^|\s|[^\w.])([@]{1,3}|[!#])([a-zA-Z0-9_\-]+)/g;

// Keep NOTE_REGEX separate
export const NOTE_REGEX = /\[\[([^\]]+?)\]\]/g;

export const replaceNoteLinks = (
  text: string,
  notes: { title: string; id: string }[],
): string => {
  return text.replace(NOTE_REGEX, (_match, noteContent: string) => {
    const noteObject = notes.find((note) => note.title === noteContent);
    if (noteObject) {
      return `<a href="/notes/${noteObject.id}" class="text-accent">${noteContent}</a>`;
    }
    return noteContent;
  });
};

export const calcLongText = (
  text: string,
  postNotes: { title: string; id: string }[],
): string =>
  replaceNoteLinks(
    text.replace(
      HIGHLIGHT_REGEX,
      ` <a href="/$1$2" class="text-accent">$1$2</a>`,
    ),
    postNotes,
  );

export const calcShortText = (
  text: string,
  postNotes: { title: string; id: string }[],
): string => {
  return calcLongText(
    text.length > 280
      ? text.substring(0, 260) + "..." // show less than condition to ensure there is something to show
      : text.split("\n\n").length > 5
        ? text.split("\n\n").slice(0, 4).join("\n\n") + "..."
        : text,
    postNotes,
  );
};
