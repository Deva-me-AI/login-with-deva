import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import manifest from "../../package.json";
it("ships a standalone server entry with declarations and no runtime imports", () => {
  const entry = manifest.exports["./server"];
  const code = readFileSync(
    new URL(`../../${entry.import}`, import.meta.url),
    "utf8",
  );
  expect(code).not.toMatch(/\bimport\s|\brequire\s*\(|\bfrom\s+["']/);
  expect(code).not.toMatch(/react|RichTextEditor|Intercom/);
  expect(
    readFileSync(new URL(`../../${entry.types}`, import.meta.url), "utf8"),
  ).toContain("createDevaAI");
  expect(manifest.files).toContain(entry.import.slice(2));
  expect(manifest.files).toContain(entry.types.slice(2));
});
