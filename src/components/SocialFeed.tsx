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

interface Persona {
  id: string;
  display_name: string;
  username: string;
  description: string | null;
  avatar: string | null;
}

interface Post {
  id: string;
  text: string;
  likes_count: number;
  replies_count: number;
  persona: Persona;
  created_at?: string;
  in_reply_to_id: string | null;
}

const dummyPosts: Post[] = [
  {
    id: "1",
    text: "@elonmusk what do you think of the current tariff situation?",
    likes_count: 0,
    replies_count: 1,
    created_at: "5m",
    in_reply_to_id: null,
    persona: {
      id: "1",
      display_name: "bbig",
      username: "ffoobarbaz110",
      description: null,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    text: "Tariffs are a big deal, especially for industries like ours. Ideally, we'd have no tariffs at all, which would make things a lot simpler and fairer. I've mentioned before that competing with heavy tariffs is like running with lead shoes – it just doesn't make ...",
    likes_count: 0,
    replies_count: 1,
    created_at: "5m",
    in_reply_to_id: "1",
    persona: {
      id: "2",
      display_name: "Elon Musk",
      username: "elonmusk",
      description: null,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    text: "All you need to know to understand which company will win a technology competition is look at the first and second derivatives of the rate of innovation",
    likes_count: 15,
    replies_count: 3,
    created_at: "35m",
    in_reply_to_id: null,
    persona: {
      id: "2",
      display_name: "Elon Musk",
      username: "elonmusk",
      description: null,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
];

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [newPostText, setNewPostText] = useState("");

  // Group posts by parent-child relationship
  const groupedPosts = posts.reduce((acc: Record<string, Post[]>, post) => {
    if (post.in_reply_to_id === null) {
      if (!acc[post.id]) {
        acc[post.id] = [post];
      } else {
        acc[post.id]?.unshift(post);
      }
    } else {
      if (!acc[post.in_reply_to_id]) {
        acc[post.in_reply_to_id] = [];
      }
      acc[post.in_reply_to_id]?.push(post);
    }
    return acc;
  }, {});

  return (
    <div className="mx-auto h-full max-w-xl bg-black text-white">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <h1 className="text-lg font-bold">For you</h1>
        <Button variant="ghost" className="text-white hover:bg-gray-800">
          Channel
        </Button>
      </div>

      <div className="border-b border-gray-800 p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="@deva_support"
            />
            <AvatarFallback className="text-black">DS</AvatarFallback>
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

      <ScrollArea className="h-[calc(100vh-120px)]">
        {Object.entries(groupedPosts).map(([parentId, relatedPosts]) => (
          <div key={parentId}>
            {relatedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                isParent={index === 0 && relatedPosts.length > 1}
                hasReply={index === 0 && relatedPosts.length > 1}
              />
            ))}
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
              alt={post.persona.display_name}
            />
            <AvatarFallback className="text-black">
              {post.persona.display_name.charAt(0)}
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
