import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeva } from "@/use-deva";
import type {
  Post,
  Channel,
  PagintedPostWithReply,
  CreatePostInput,
  PostWithReply,
  FullDbPost,
} from "@/server";
import { Skeleton } from "./ui/skeleton";
import { fetcher, useSWRFetcher } from "@/lib/fetcher";
import { type Envs, envToUrl } from "@/config";
import monk from "@/images/space_monk.png";
import { PostInput } from "./PostEditor/PostInput";

interface UsePostsParams {
  handle?: string;
  env: Envs;
  limit?: number;
  cursor?: string;
}

const usePosts = ({ handle, env, limit = 20 }: UsePostsParams) => {
  const url = envToUrl(env);
  const { accessToken } = useDeva();
  const [cursor, setCursor] = useState(0);
  const [allPosts, setAllPosts] = useState<PagintedPostWithReply["items"]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);
  const {
    data: channel,
    isLoading: isChannelLoading,
    error: channelFetchError,
  } = useSWRFetcher<Channel, Error>(
    handle ? `${url}/api/sdk/channel/handle/${handle}` : null,
  );

  useEffect(() => {
    if (channelFetchError) {
      setChannelError("Channel not found");
    } else {
      setChannelError(null);
    }
  }, [channelFetchError]);

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    cursor: cursor.toString(),
    channel_id: channel?.id ?? "",
  }).toString();

  const { data: posts, isLoading } = useSWRFetcher<
    PagintedPostWithReply,
    Error
  >(channel?.id ? `${url}/api/sdk/feed?${queryParams}` : null);

  const total = posts?.total ?? 0;

  // Update allPosts when new posts are loaded
  // TODO: fix duplicate posts when loading more
  useEffect(() => {
    if (posts?.items) {
      if (cursor === 0) {
        setAllPosts(posts.items);
      } else {
        setAllPosts((prev) => [...prev, ...posts.items]);
      }
    }
  }, [posts?.items, cursor]);

  const createPost = async (input: CreatePostInput) => {
    try {
      setIsCreating(true);
      const fullPost = await fetcher<FullDbPost>(`${url}/api/sdk/feed/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input),
      });

      // Convert FullDbPost to PostWithReply
      const postWithReply: PostWithReply = {
        ...fullPost,
        first_reply: null,
        in_reply_to: null,
      };

      setAllPosts((prev) => [postWithReply, ...prev]);

      return postWithReply;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    channel,
    posts: allPosts,
    isLoading: isChannelLoading || isLoading,
    isCreating,
    createPost,
    channelError,
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
  const {
    posts,
    channel,
    isLoading,
    isCreating,
    createPost,
    pagination,
    channelError,
  } = usePosts({ handle, env });
  const [newPostText, setNewPostText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    if (!newPostText.trim() || !channel) return;

    try {
      setError(null);
      await createPost({
        text: newPostText.trim(),
        channel_id: channel.id,
      });
      setNewPostText(""); // Clear input on success
    } catch {
      setError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="h-full w-full max-w-2xl overflow-hidden bg-black text-white">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <h1 className="text-lg font-bold">
            {channel?.name ?? channelError ?? "Channel"}
          </h1>
        )}
      </div>

      {isAuthenticated && user && (
        <div className="border-b border-gray-800 p-4">
          <div className="mb-2 flex flex-wrap gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.persona?.avatar ?? user.picture ?? undefined}
                alt="@deva_support"
              />
              <AvatarFallback className="text-black">
                {user?.preferred_username?.slice(0, 1)?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 px-1">
              <PostInput
                id="new-post"
                value={newPostText}
                placeholder="use '@' to mention a deva"
              />
              {/*}
              <Input
                ref={inputRef}
                placeholder="Use @ to mention a deva"
                className="border-0 bg-transparent p-0 text-white placeholder:text-gray-500 focus-visible:ring-0"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleCreatePost();
                  }
                }}
              />
              {*/}
            </div>
          </div>
          <div className="mb-2 flex flex-wrap justify-between">
            <div className="flex items-end text-sm">
              Use&nbsp;<span className="text-accent-500">@</span>&nbsp;to
              mention a deva
            </div>
            <Button
              variant="ghost"
              className="text-gray-500 hover:bg-transparent hover:text-white"
              disabled={!newPostText.trim() || isCreating}
              onClick={handleCreatePost}
            >
              {isCreating ? "Posting..." : "Post"}
            </Button>
            {error && (
              <p className="mt-2 w-full text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-120px)] sm:h-[600px]">
        {channelError ? (
          <ChannelNotFound />
        ) : isLoading && posts.length === 0 ? (
          <>
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </>
        ) : posts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-500" />
            <h3 className="mt-4 text-lg font-semibold">No posts yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Be the first to start a conversation in this channel!
            </p>
            {isAuthenticated && (
              <Button
                onClick={() => {
                  inputRef.current?.focus();
                }}
                variant="outline"
                className="mt-6 border-gray-800"
              >
                Create a post
              </Button>
            )}
          </div>
        ) : (
          <>
            {posts.map((_post) => {
              const isParent = !!(_post.in_reply_to ?? _post.first_reply);
              const post = _post.in_reply_to ?? _post;
              const reply = _post.in_reply_to ? _post : _post.first_reply;
              return (
                <div key={post.in_reply_to_id ?? post.id}>
                  <PostCard post={post} isParent={isParent} />
                  {reply && <PostCard post={reply} isReply={true} />}
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

function ChannelNotFound() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-secondary p-6 text-center">
        <div className="mb-6">
          <img
            src={monk}
            alt="Astronaut monkey illustration"
            className="mx-auto h-[200px]"
          />
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-white">
          This Channel doesn&apos;t exist
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          It might&apos;ve been removed, or perhaps it was never here. The
          digital world is full of surprises.
        </p>
      </div>
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
  isReply,
}: {
  post: Post;
  isParent?: boolean;
  isReply?: boolean;
}) {
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

      {isReply && (
        <div className="absolute left-[36px] top-0 h-1/4 w-[2px] bg-gray-800" />
      )}
    </div>
  );
}
