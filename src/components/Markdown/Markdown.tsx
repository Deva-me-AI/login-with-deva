import {
  type FunctionComponent,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
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

export const MD_COMPONENTS: MarkdownComponentsDict = {
  h1: function MDh1(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h1 className="text-3xl" {...rest} />;
  },
  h2: function MDh2(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h2 className="text-2xl" {...rest} />;
  },
  h3: function MDh3(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h3 className="text-xl" {...rest} />;
  },
  h4: function MDh4(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="text-lg" {...rest} />;
  },
  h5: function MDh5(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="text-lg" {...rest} />;
  },
  h6: function MDh6(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <h4 className="text-lg" {...rest} />;
  },
  a: function MDa(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <a className="text-[#cef049]" {...rest} />;
  },
  ul: function MDul(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <ul className="flex flex-col gap-2" {...rest} />;
  },
  ol: function MDol(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...rest } = props;
    return <ol className="flex flex-col gap-2" {...rest} />;
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
      rehypePlugins={[rehypeRaw, remarkGfm]}
      components={MD_COMPONENTS}
    >
      {children}
    </ReactMarkdown>
  );
};
