import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Markdown,
  MD_COMPONENTS,
  sanitizeMarkdownUrl,
} from "../components/Markdown/Markdown";

describe("Markdown", () => {
  it("renders raw HTML as inert text", () => {
    const html = renderToString(
      <Markdown>{`<img src=x onerror=alert(1)><script>alert(1)</script>`}</Markdown>,
    );

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops dangerous link protocols", () => {
    const html = renderToString(
      <Markdown>{`[bad](javascript:alert(1)) [also-bad](java\nscript:alert(1)) [ok](https://example.com)`}</Markdown>,
    );

    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('href="java');
    expect(html).toContain('href="https://example.com"');
  });

  it("does not let extra markdown anchor props override safe props", () => {
    const Anchor = MD_COMPONENTS.a!;
    const html = renderToString(
      <Anchor
        node={null}
        href="https://example.com"
        rel="opener"
        target="_blank"
        title="Example"
      >
        safe
      </Anchor>,
    );

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('title="Example"');
    expect(html).not.toContain('rel="opener"');
    expect(html).not.toContain("target=");
  });
});

describe("sanitizeMarkdownUrl", () => {
  it("allows safe absolute and relative URLs", () => {
    expect(sanitizeMarkdownUrl("https://example.com/path")).toBe(
      "https://example.com/path",
    );
    expect(sanitizeMarkdownUrl("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
    expect(sanitizeMarkdownUrl("/@alice")).toBe("/@alice");
    expect(sanitizeMarkdownUrl("#section")).toBe("#section");
    expect(sanitizeMarkdownUrl("?tab=posts")).toBe("?tab=posts");
  });

  it("rejects dangerous protocols after normalization", () => {
    expect(sanitizeMarkdownUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeMarkdownUrl("java\nscript:alert(1)")).toBe("");
    expect(sanitizeMarkdownUrl("//example.com/path")).toBe("");
    expect(sanitizeMarkdownUrl("data:text/html,<svg onload=alert(1)>")).toBe(
      "",
    );
  });
});
