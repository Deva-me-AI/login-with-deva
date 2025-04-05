import { useCallback, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FullDbPost, Post, ReactPostInput } from "@/server";
import { useFormattedText } from "./utils";
import { type Envs, envToUrl } from "@/config";
import { cn } from "@/lib/utils";
import { useDevaContext } from "@/DevaContext";
import { relativeTimeFrom } from "@/lib/time";
import { Markdown } from "../Markdown";

const useFavorite = ({
  env,
  isFavorited,
  postId,
}: {
  env: Envs;
  isFavorited: boolean;
  postId: string;
  onUpdated?: (post: FullDbPost) => void;
}) => {
  const url = envToUrl(env);
  const { accessToken } = useDevaContext();

  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const toggleFavorite = useCallback(async () => {
    if (!accessToken) {
      throw new Error("Authentication required");
    }

    try {
      const endpoint = `${url}/api/sdk/feed/post/${postId}/react`;
      const input: ReactPostInput = {
        reaction: isFavorited ? "DISLIKE" : "LIKE",
      };

      const res = await fetcher<FullDbPost>(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input),
      });

      return res;
    } catch (error) {
      console.error(
        `Error ${isFavorited ? "adding" : "removing"} reaction:`,
        error,
      );
      throw error;
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [accessToken, isFavorited, postId, url]);

  return {
    isFavoriteLoading,
    toggleFavorite,
  };
};

export function PostCard({
  post,
  isParent,
  isReply,
  onUpdated,
}: {
  post: Post;
  isParent?: boolean;
  isReply?: boolean;
  onUpdated?: (post: FullDbPost) => void;
}) {
  const { env, isAuthenticated } = useDevaContext();
  const isFavorited = post.user_reaction === "LIKE";

  const text = useFormattedText({
    text: post.text,
    notes: [],
    baseUrl: envToUrl(env),
  });

  const timeFromNow = relativeTimeFrom(post.created_at);
  const { toggleFavorite } = useFavorite({
    env,
    isFavorited,
    postId: post.id,
    onUpdated,
  });

  return (
    <div
      className={`deva-relative ${isParent ? "deva-pb-0" : "deva-border-b deva-border-gray-800"} deva-transition-colors hover:deva-bg-gray-900/50`}
    >
      {/* Connection line for replies */}
      {isParent && (
        <div className="deva-absolute deva-bottom-0 deva-left-[36px] deva-h-1/2 deva-w-[2px] deva-bg-gray-800" />
      )}

      <div className={`deva-p-4 ${isParent ? "deva-pb-2" : ""}`}>
        <div className="deva-flex deva-gap-3">
          <Avatar className="deva-relative deva-z-10 deva-h-10 deva-w-10">
            <AvatarImage
              src={post.persona.avatar ?? "/placeholder.svg"}
              alt={post.persona.display_name ?? post.persona.username ?? "User"}
            />
            <AvatarFallback className="deva-text-black">
              {post?.persona?.display_name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="deva-flex-1">
            <div className="deva-flex deva-items-center deva-justify-between">
              <div className="deva-flex deva-flex-wrap deva-items-center deva-gap-x-2 deva-gap-y-1">
                <span className="deva-cursor-pointer deva-font-bold hover:deva-underline">
                  {post.persona.display_name}
                </span>
                <span className="deva-text-sm deva-text-gray-500">
                  @{post.persona.username}
                </span>
                <span className="deva-text-sm deva-text-gray-500">· {timeFromNow}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="deva-h-8 deva-w-8 deva-rounded-full deva-text-gray-500 hover:deva-bg-blue-600/10 hover:deva-text-white"
                  >
                    <MoreHorizontal className="deva-h-5 deva-w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="deva-border-gray-800 deva-bg-black deva-text-white"
                >
                  <DropdownMenuItem className="hover:deva-bg-gray-900">
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:deva-bg-gray-900">
                    Bookmark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

              <div
                className={`deva-mt-1 deva-text-[15px] deva-leading-normal ${isParent ? "deva-line-clamp-1" : ""}`}
              >
              <Markdown>{text}</Markdown>
            </div>

            {!isParent && (
              <div className="deva-mt-3 deva-flex deva-flex-wrap deva-gap-x-8 deva-gap-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("deva-h-auto deva-p-0 hover:deva-bg-transparent", {
                    "deva-text-red-500 hover:deva-text-red-400": isFavorited,
                    "deva-text-gray-500 hover:deva-text-white": !isFavorited,
                  })}
                  disabled={!isAuthenticated}
                  onClick={toggleFavorite}
                >
                  <Heart
                    className={`deva-mr-1.5 deva-h-4 deva-w-4 ${isFavorited ? "deva-fill-current" : ""}`}
                  />
                  <span className="deva-text-sm">{post.likes_count ?? 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="deva-h-auto deva-p-0 deva-text-gray-500 hover:deva-bg-transparent hover:deva-text-white"
                  disabled={true} // TODO: Implement replies
                >
                  <MessageCircle className="deva-mr-1.5 deva-h-4 deva-w-4" />
                  <span className="deva-text-sm">{post.replies_count}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isReply && (
        <div className="deva-absolute deva-left-[36px] deva-top-0 deva-h-1/4 deva-w-[2px] deva-bg-gray-800" />
      )}
    </div>
  );
}
