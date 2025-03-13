import { useMemo } from "react";

// Match human and deva mentions only
const HIGHLIGHT_REGEX = /(?:^|\s|[^\w.])([@]{1,3}|[!#])([a-zA-Z0-9_\-]+)/g;

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
      return `<a href="${baseUrl}/notes/${noteObject.id}" class="text-accent">${noteContent}</a>`;
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
      ` <a href="${baseUrl}/$1$2" class="text-accent">$1$2</a>`,
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
type TimeUnit = "now" | "second" | "minute" | "hour" | "month";

type LocaleTimeFormat = {
  one: string;
  other: string;
};

type LocaleDefinition = {
  now: string;
  second: LocaleTimeFormat;
  minute: LocaleTimeFormat;
  hour: LocaleTimeFormat;
  month: string[];
};

type Locales = {
  def: LocaleDefinition;
  en: LocaleDefinition;
};

type Conversions = Record<Exclude<TimeUnit, "month">, number>;

const LOCALES: Locales = {
  def: {
    now: "Now",
    second: { one: "%ns", other: "%ns" },
    minute: { one: "%nm", other: "%nm" },
    hour: { one: "%nh", other: "%nh" },
    month: [
      "%n Jan",
      "%n Feb",
      "%n Mar",
      "%n Apr",
      "%n May",
      "%n Jun",
      "%n Jul",
      "%n Aug",
      "%n Sep",
      "%n Oct",
      "%n Nov",
      "%n Dec",
    ],
  },
  en: {
    now: "Now",
    second: { one: "%n second ago", other: "%n seconds ago" },
    minute: { one: "%n minute ago", other: "%n minutes ago" },
    hour: { one: "%n hour ago", other: "%n hours ago" },
    month: [
      "%n January",
      "%n February",
      "%n March",
      "%n April",
      "%n May",
      "%n June",
      "%n July",
      "%n August",
      "%n September",
      "%n October",
      "%n November",
      "%n December",
    ],
  },
};

const CONVERSIONS: Conversions = {
  now: 1, // ms    -> ms
  second: 1000, // ms    -> sec
  minute: 60, // sec   -> min
  hour: 60, // min   -> hour
};

// Logic borrowed from https://github.com/dforest/twitter-relative-time-js/
export const relativeTimeFrom = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const locale = "def" as keyof Locales;

  const t = function (key: TimeUnit): string | LocaleTimeFormat | string[] {
    return LOCALES[locale][key];
  };

  const localize = (delta: number | Date, unit_key: TimeUnit): string => {
    let unit = t(unit_key);

    if (unit_key === "month" && delta instanceof Date) {
      const monthArray = unit as string[];
      const monthString = monthArray[delta.getMonth()];
      return monthString?.replace("%n", delta.getDate().toString()) ?? "";
    } else if (unit_key !== "now") {
      const timeFormat = unit as LocaleTimeFormat;
      const numericDelta = delta as number;
      unit = numericDelta === 1 ? timeFormat.one : timeFormat.other;
      return unit.replace("%n", numericDelta.toString());
    }

    return unit as string;
  };

  const now = new Date();
  let delta = now.getTime() - date.getTime();
  delta = Math.abs(delta);

  let unit_key: TimeUnit = "now";

  // Find the appropriate time unit based on delta
  for (const key in CONVERSIONS) {
    const timeKey = key as Exclude<TimeUnit, "month">;
    if (delta < CONVERSIONS[timeKey]) break;
    unit_key = timeKey;
    delta = delta / CONVERSIONS[timeKey];
  }

  if (unit_key === "hour" && delta / 24 >= 1) {
    // Older than 24 hours
    return localize(date, "month");
  }

  delta = Math.floor(delta);

  return localize(delta, unit_key);
};
