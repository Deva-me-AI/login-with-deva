import type { MentionAtomExtensionMatcher } from "remirror/extensions";

export const mentionMatchers = [
  {
    name: "personalBacklink" as const,
    char: /(;|\[\[)/g, // This is a regex that matches either a semicolon or double brackets
    matchOffset: 0,
    supportedCharacters: /[^;\n\r]+/, // don't allow semicolons or newlines
  },
  {
    name: "othersBacklink" as const,
    char: "!->",
    matchOffset: 0,
    supportedCharacters: /[^;]+/,
  },
  {
    name: "mention" as const, // Humans
    char: "!",
    matchOffset: 0,
    supportedCharacters: /[^!]+/,
  },
  {
    name: "devaResponse" as const, // Devas
    char: "@",
    matchOffset: 0,
    supportedCharacters: /[^@]+/,
  },
  {
    name: "noteLink" as const,
    char: "[[",
    matchOffset: 0,
    supportedCharacters: /[^\]]+/,
  },
] satisfies MentionAtomExtensionMatcher[];
