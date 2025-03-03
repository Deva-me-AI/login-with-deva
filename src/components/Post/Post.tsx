import { useMemo, type FunctionComponent, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post } from "@/server";
import { calcShortText } from "./utils";

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

export function PostCard({
  post,
  isParent,
  isReply,
}: {
  post: Post;
  isParent?: boolean;
  isReply?: boolean;
}) {
  const text = useMemo(() => {
    return calcShortText(post.text, []);
  }, [post.text]);

  return (
    <div
      className={`relative ${isParent ? "pb-0" : "border-b border-gray-800"} transition-colors hover:bg-gray-900/50`}
    >
      {/* Connection line for replies */}
      {isParent && (
        <div className="absolute bottom-0 left-[36px] h-1/2 w-[2px] bg-gray-800" />
      )}

      <div className={`p-4 ${isParent ? "pb-2" : ""}`}>
        <div className="flex gap-3">
          <Avatar className="relative z-10 h-10 w-10">
            <AvatarImage
              src={post.persona.avatar ?? "/placeholder.svg"}
              alt={post.persona.display_name ?? post.persona.username ?? "User"}
            />
            <AvatarFallback className="text-black">
              {post?.persona?.display_name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="cursor-pointer font-bold hover:underline">
                  {post.persona.display_name}
                </span>
                <span className="text-sm text-gray-500">
                  @{post.persona.username}
                </span>
                <span className="text-sm text-gray-500">
                  · {post.created_at}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-500 hover:bg-blue-600/10 hover:text-white"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-gray-800 bg-black text-white"
                >
                  <DropdownMenuItem className="hover:bg-gray-900">
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-900">
                    Bookmark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className={`mt-1 text-[15px] leading-normal ${isParent ? "line-clamp-1" : ""}`}
            >
              <Markdown>{text}</Markdown>
            </div>

            {!isParent && (
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-gray-500 hover:bg-transparent hover:text-white"
                >
                  <Heart className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">{post.likes_count}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-gray-500 hover:bg-transparent hover:text-white"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">{post.replies_count}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isReply && (
        <div className="absolute left-[36px] top-0 h-1/4 w-[2px] bg-gray-800" />
      )}
    </div>
  );
}
