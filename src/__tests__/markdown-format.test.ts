import { describe, expect, it } from "vitest";
import {
  linkMentionsForMarkdown,
  markdownLink,
  replaceNoteLinksForMarkdown,
} from "../lib/markdown-format";

describe("markdown formatting helpers", () => {
  it("formats mentions as markdown links instead of raw HTML", () => {
    expect(linkMentionsForMarkdown("hello @alice", "https://deva.me")).toBe(
      "hello [@alice](https://deva.me/@alice)",
    );
  });

  it("formats note references as markdown links instead of raw HTML", () => {
    expect(
      replaceNoteLinksForMarkdown(
        "read [[Launch Plan]]",
        [{ title: "Launch Plan", id: "note 1" }],
        "https://deva.me",
      ),
    ).toBe("read [Launch Plan](https://deva.me/notes/note%201)");
  });

  it("leaves missing note references as plain text", () => {
    expect(replaceNoteLinksForMarkdown("read [[Missing]]", [])).toBe(
      "read Missing",
    );
  });

  it("escapes generated markdown link destinations", () => {
    expect(markdownLink("Draft", "https://deva.me/(draft)\\ path")).toBe(
      "[Draft](https://deva.me/%28draft%29%5C%20path)",
    );
  });
});
