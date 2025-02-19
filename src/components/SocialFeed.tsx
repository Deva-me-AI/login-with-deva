"use client";

import { useState } from "react";
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
import type { Post, PostResponseTuple } from "@/server";
import { mock } from "./feed";
import useSWR from "swr";

const usePosts = () => {
  const { data: posts = [], isLoading } = useSWR<PostResponseTuple[], Error>(
    "/api/posts",
    async (_url: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mock.result.data.json.pairs;
    },
  );

  const [newPostText, setNewPostText] = useState("");

  return { posts, newPostText, setNewPostText, isLoading };
};

export function SocialFeed() {
  const { posts } = usePosts();
  const [newPostText, setNewPostText] = useState("");
  const { isAuthenticated, user } = useDeva();

  return (
    <div className="mx-auto h-full max-w-xl bg-black text-white">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <h1 className="text-lg font-bold">For you</h1>
        <Button variant="ghost" className="text-white hover:bg-gray-800">
          Channel
        </Button>
      </div>

      {isAuthenticated && user && (
        <div className="border-b border-gray-800 p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  user.persona?.avatar ??
                  user.picture ??
                  "/placeholder.svg?height=40&width=40"
                }
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

      <ScrollArea className="h-[calc(100vh-120px)]">
        {posts.map(([post, reply]) => (
          <div key={post.id}>
            <PostCard post={post} isParent={!!reply} hasReply={!!reply} />
            {reply && <PostCard key={reply.id} post={reply} hasReply={false} />}
          </div>
        ))}
      </ScrollArea>
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
      {post.in_reply_to_id && connector}

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
              <div className="flex items-center gap-2">
                <span className="cursor-pointer font-bold hover:underline">
                  {post.persona.display_name}
                </span>
                <span className="text-gray-500">@{post.persona.username}</span>
                <span className="text-gray-500">· {post.created_at}</span>
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
              <div className="mt-3 flex gap-8">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-gray-500 hover:bg-transparent hover:text-white"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {post.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-gray-500 hover:bg-transparent hover:text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.replies_count}
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
