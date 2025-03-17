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

export const dateToTime = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  } else if (!("getHours" in date)) {
    console.warn("dateToTime: date is not a Date object", date);
    return "";
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
};

export const dateFormatter = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);

  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
