"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeva } from "@/use-deva";
import type { Post, Channel, PagintedPostWithReply } from "@/server";
import { Skeleton } from "./ui/skeleton";
import { useSWRFetcher } from "@/lib/fetcher";
import { type Envs, envToUrl } from "@/config";

interface UsePostsParams {
  handle?: string;
  env: Envs;
  limit?: number;
  cursor?: string;
}

const usePosts = ({ handle, env, limit = 20 }: UsePostsParams) => {
  const url = envToUrl(env);
  const [cursor, setCursor] = useState(0);
  const [allPosts, setAllPosts] = useState<PagintedPostWithReply["items"]>([]);
  const { data: channel, isLoading: isChannelLoading } = useSWRFetcher<Channel, Error>(
    handle ? `${url}/api/sdk/channel/handle/${handle}` : null,
  );

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    cursor: cursor.toString(),
    channel_id: channel?.id ?? "",
  }).toString();

  const { data: posts, isLoading } = useSWRFetcher<
    PagintedPostWithReply,
    Error
  >(channel ? `${url}/api/sdk/feed?${queryParams}` : null);

  const total = posts?.total ?? 0;

  // Update allPosts when new posts are loaded
  useEffect(() => {
    if (posts?.items) {
      if (cursor === 0) {
        setAllPosts(posts.items);
      } else {
        setAllPosts((prev) => [...prev, ...posts.items]);
      }
    }
  }, [posts?.items, cursor]);

  return {
    channel,
    posts: allPosts,
    isLoading: isChannelLoading || isLoading,
    pagination: {
      hasNext: total > cursor + limit,
      next: () => {
        setCursor((c) => c + limit);
      },
      hasPrev: cursor > 0,
      prev: () => {
        setCursor((c) => Math.min(c - limit, 0));
      },
    },
  };
};

interface ChannelFeedProps {
  handle?: string;
}

export function ChannelFeed({ handle }: ChannelFeedProps) {
  const { isAuthenticated, user, env } = useDeva();
  const { posts, channel, isLoading, pagination } = usePosts({ handle, env });
  const [newPostText, setNewPostText] = useState("");

  return (
    <div className="h-full w-full max-w-2xl overflow-hidden bg-black text-white">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <h1 className="text-lg font-bold">{channel?.name ?? "Channel"}</h1>
        )}
      </div>

      {isAuthenticated && user && (
        <div className="border-b border-gray-800 p-4">
          <div className="flex flex-wrap gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.persona?.avatar ?? user.picture ?? undefined}
                alt="@deva_support"
              />
              <AvatarFallback className="text-black">
                {user?.preferred_username?.slice(0, 1)?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Use @ to mention a deva"
                className="border-0 bg-transparent p-0 text-white placeholder:text-gray-500 focus-visible:ring-0"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              className="text-gray-500 hover:bg-transparent hover:text-white"
              disabled={!newPostText.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-120px)] sm:h-[600px]">
        {isLoading && posts.length === 0 ? (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        ) : (
          <>
            {posts.map((_post) => {
              const isParent = !_post.in_reply_to;
              const post = _post.in_reply_to ?? _post;
              const reply = _post.in_reply_to ? _post : _post.first_reply;
              return (
                <div key={post.in_reply_to_id ?? post.id}>
                  <PostCard
                    post={post}
                    isParent={isParent}
                    hasReply={!!reply}
                  />
                  {reply && <PostCard post={reply} hasReply={false} />}
                </div>
              );
            })}
            {pagination.hasNext && (
              <div
                className="p-4"
                ref={(el) => {
                  if (!el) return;

                  const observer = new IntersectionObserver(
                    (entries) => {
                      if (entries?.[0]?.isIntersecting && !isLoading) {
                        pagination.next();
                      }
                    },
                    { threshold: 0.5 },
                  );

                  observer.observe(el);
                  return () => observer.disconnect();
                }}
              >
                <div className="flex justify-center">
                  {isLoading ? (
                    <SkeletonPost />
                  ) : (
                    <span className="text-sm text-gray-500">
                      Loading more...
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </div>
  );
}

function SkeletonPost() {
  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
          <div className="mt-4 flex gap-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  isParent,
  hasReply,
}: {
  post: Post;
  isParent?: boolean;
  hasReply?: boolean;
}) {
  const connector = (
    <div className="absolute left-[36px] top-0 h-full w-[2px] bg-gray-800" />
  );
  return (
    <div
      className={`relative ${isParent ? "pb-0" : "border-b border-gray-800"} transition-colors hover:bg-gray-900/50`}
    >
      {/* Connection line for replies */}
      {isParent && connector}

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

            <p
              className={`mt-1 text-[15px] leading-normal ${isParent ? "line-clamp-1" : ""}`}
            >
              {post.text}
            </p>

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

      {hasReply && connector}
    </div>
  );
}
