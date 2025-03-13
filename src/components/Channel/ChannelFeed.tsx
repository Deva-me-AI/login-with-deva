import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { useDeva } from "@/use-deva";
import type {
  Channel,
  PagintedPostWithReply,
  CreatePostInput,
  PostWithReply,
  FullDbPost,
} from "@/server";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, useSWRFetcher } from "@/lib/fetcher";
import { type Envs, envToUrl } from "@/config";
import { PostInput } from "@/components/PostEditor/PostInput";
import { PostCard } from "@/components/Post/Post";
import { SkeletonPost } from "./SkeletonPost";
import { ChannelNotFound } from "./NotFound";
import { useDevaContext } from "@/DevaContext";

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

  // Use a map to store posts by ID and an array to maintain order
  const [postsMap, setPostsMap] = useState<Record<string, PostWithReply>>({});
  const [postsOrder, setPostsOrder] = useState<string[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);

  const updatePost = (post: FullDbPost) => {
    setPostsMap((prevMap) => {
      const postId = post.id;
      if (!prevMap[postId]) return prevMap;

      return {
        ...prevMap,
        [postId]: post,
      };
    });
  };

  const {
    data: channel,
    isLoading: isChannelLoading,
    error: channelFetchError,
  } = useSWRFetcher<Channel, Error>(
    handle ? `${url}/api/sdk/channel/handle/${handle}` : null,
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
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
  >(channel?.id ? `${url}/api/sdk/feed?${queryParams}` : null, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  const total = posts?.total ?? 0;

  // Update posts storage when new posts are loaded
  useEffect(() => {
    if (posts?.items) {
      if (cursor === 0) {
        // Reset for first page
        const newMap: Record<string, PostWithReply> = {};
        const newOrder: string[] = [];

        posts.items.forEach((post) => {
          const postId = post.in_reply_to_id ?? post.id;
          newMap[postId] = post;
          newOrder.push(postId);
        });

        setPostsMap(newMap);
        setPostsOrder(newOrder);
      } else {
        // Append for pagination
        setPostsMap((prevMap) => {
          const newMap = { ...prevMap };

          posts.items.forEach((post) => {
            const postId = post.in_reply_to_id ?? post.id;
            newMap[postId] = post;
          });

          return newMap;
        });

        setPostsOrder((prevOrder) => {
          const newIds = posts.items
            .map((post) => post.in_reply_to_id ?? post.id)
            .filter((id) => !prevOrder.includes(id));

          return [...prevOrder, ...newIds];
        });
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

      // Add new post to the map and order
      const postId = postWithReply.id;

      setPostsMap((prevMap) => ({
        [postId]: postWithReply,
        ...prevMap, // Spread after to ensure new post doesn't get overwritten
      }));

      setPostsOrder((prevOrder) => [postId, ...prevOrder]);

      return postWithReply;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Convert map and order to array for components that expect an array
  const allPosts = postsOrder
    .map((id) => postsMap[id])
    .filter((p): p is PostWithReply => !!p);

  return {
    channel,
    posts: allPosts,
    isLoading: isChannelLoading || isLoading,
    isCreating,
    createPost,
    updatePost,
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
  const { user, env } = useDevaContext();
  const isAuthenticated = user !== null;
  const {
    posts,
    channel,
    isLoading,
    isCreating,
    createPost,
    updatePost,
    pagination,
    channelError,
  } = usePosts({ handle, env });
  const [newPostText, setNewPostText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState(uuidv4());
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
      setPostId(uuidv4()); // Generate a new UUID after successful post
    } catch {
      setError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="flex h-full w-full max-w-2xl flex-col bg-black text-white">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-800 p-4">
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <h1 className="text-lg font-bold">
            {channel?.name ?? channelError ?? "Channel"}
          </h1>
        )}
      </div>

      {isAuthenticated && user && !channelError && (
        <div className="flex-shrink-0 border-b border-gray-800 p-4">
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
                postId={postId}
                value={newPostText}
                placeholder="use '@' to mention a deva"
                onChange={setNewPostText}
                onSubmit={handleCreatePost}
              />
            </div>
          </div>
          <div className="mb-2 flex flex-wrap justify-between">
            <div className="flex items-end text-sm">
              Use&nbsp;<span className="text-accent">@</span>&nbsp;to mention a
              deva
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

      <ScrollArea className="flex-grow">
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
              const postId = post.in_reply_to_id ?? post.id;

              return (
                <div key={postId}>
                  <PostCard
                    post={post}
                    isParent={isParent}
                    onUpdated={updatePost}
                  />
                  {reply && (
                    <PostCard
                      post={reply}
                      isReply={true}
                      onUpdated={updatePost}
                    />
                  )}
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
