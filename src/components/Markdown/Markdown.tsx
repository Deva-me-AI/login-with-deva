import { type FunctionComponent, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define proper types for markdown component props
interface MarkdownComponentProps {
  children: ReactNode;
  node: unknown;
  [key: string]: unknown;
}

type MarkdownComponent = FunctionComponent<MarkdownComponentProps>;

// Type for the components dictionary
type MarkdownComponentsDict = Record<string, MarkdownComponent>;

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function normalizeMarkdownUrl(href: string): string {
  return Array.from(href.trim())
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x1f && code !== 0x7f && !/\s/.test(char);
    })
    .join("");
}

export function sanitizeMarkdownUrl(href?: string): string {
  if (!href) {
    return "";
  }

  const normalizedHref = normalizeMarkdownUrl(href);

  if (
    normalizedHref.startsWith("#") ||
    (normalizedHref.startsWith("/") && !normalizedHref.startsWith("//")) ||
    normalizedHref.startsWith("./") ||
    normalizedHref.startsWith("../")
  ) {
    return normalizedHref;
  }

  try {
    const parsedUrl = new URL(normalizedHref, "https://deva.invalid");
    const hasExplicitProtocol = /^[a-z][a-z\d+.-]*:/i.test(normalizedHref);

    if (!hasExplicitProtocol) {
      return normalizedHref.startsWith("//") ? "" : normalizedHref;
    }

    return SAFE_PROTOCOLS.has(parsedUrl.protocol) ? normalizedHref : "";
  } catch {
    return "";
  }
}

export const MD_COMPONENTS: MarkdownComponentsDict = {
  h1: function MDh1(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h1 className="deva-text-3xl" {...rest} />;
  },
  h2: function MDh2(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h2 className="deva-text-2xl" {...rest} />;
  },
  h3: function MDh3(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h3 className="deva-text-xl" {...rest} />;
  },
  h4: function MDh4(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="deva-text-lg" {...rest} />;
  },
  h5: function MDh5(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="deva-text-lg" {...rest} />;
  },
  h6: function MDh6(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="deva-text-lg" {...rest} />;
  },
  a: function MDa(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, href, title, children } = props as MarkdownComponentProps & {
      href?: string;
      title?: string;
    };
    const safeHref = sanitizeMarkdownUrl(href);

    if (!safeHref) {
      return <span>{children}</span>;
    }

    return (
      <a
        className="deva-text-[#cef049]"
        href={safeHref}
        rel="noopener noreferrer"
        title={title}
      >
        {children}
      </a>
    );
  },
  ul: function MDul(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <ul className="deva-flex deva-flex-col deva-gap-2" {...rest} />;
  },
  ol: function MDol(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <ol className="deva-flex deva-flex-col deva-gap-2" {...rest} />;
  },
  li: function MDli(props: MarkdownComponentProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, children } = props;
    return <li className="">{children}</li>;
  },
};

export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      urlTransform={sanitizeMarkdownUrl}
      components={MD_COMPONENTS}
    >
      {children}
    </ReactMarkdown>
  );
};
