const MENTION_REGEX = /(^|\s|[^\w.])([@]{1,3}|[!#])([a-zA-Z0-9_-]+)/g;

export type MarkdownNote = {
  title: string;
  id: string;
};

const normalizeBaseUrl = (baseUrl = ""): string => baseUrl.replace(/\/+$/, "");

const escapeMarkdownLinkLabel = (label: string): string =>
  label.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");

const escapeMarkdownLinkDestination = (href: string): string =>
  href
    .replace(/\\/g, "%5C")
    .replace(/\s/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");

export const markdownLink = (label: string, href: string): string =>
  `[${escapeMarkdownLinkLabel(label)}](${escapeMarkdownLinkDestination(href)})`;

export const linkMentionsForMarkdown = (text: string, baseUrl = ""): string => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return text.replace(
    MENTION_REGEX,
    (_match, leading: string, prefix: string, handle: string) => {
      const token = `${prefix}${handle}`;
      return `${leading}${markdownLink(token, `${normalizedBaseUrl}/${token}`)}`;
    },
  );
};

export const replaceNoteLinksForMarkdown = (
  text: string,
  notes: MarkdownNote[],
  baseUrl = "",
): string => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return text.replace(/\[\[([^\]]+?)\]\]/g, (_match, noteContent: string) => {
    const noteObject = notes.find((note) => note.title === noteContent);

    if (!noteObject) {
      return noteContent;
    }

    return markdownLink(
      noteContent,
      `${normalizedBaseUrl}/notes/${encodeURIComponent(noteObject.id)}`,
    );
  });
};
