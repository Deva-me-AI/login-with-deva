"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface User {
  id: string;
  display_name: string;
  username: string;
  description: string | null;
  avatar: string | null;
}

interface Post {
  id: string;
  user: User;
  content: string;
  likes: number;
  comments: number;
  shares: number;
}

const dummyPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "1",
      display_name: "John Doe",
      username: "johndoe",
      description: "Software Developer",
      avatar: "/placeholder.svg",
    },
    content: "Just finished a great coding session! #programming #javascript",
    likes: 15,
    comments: 3,
    shares: 2,
  },
  {
    id: "2",
    user: {
      id: "2",
      display_name: "Jane Smith",
      username: "janesmith",
      description: "UX Designer",
      avatar: "/placeholder.svg",
    },
    content: "Working on some new design concepts. Excited to share soon!",
    likes: 24,
    comments: 5,
    shares: 1,
  },
];

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demonstration purposes

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: String(posts.length + 1),
        user: {
          id: "current-user",
          display_name: "Current User",
          username: "currentuser",
          description: null,
          avatar: "/placeholder.svg",
        },
        content: newPostContent,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {isLoggedIn && (
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-lg font-semibold">Create a new post</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewPost}>Post</Button>
          </CardFooter>
        </Card>
      )}
      <ScrollArea className="h-[600px]">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollArea>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={post.user.avatar ?? "/placeholder.svg"}
            alt={post.user.display_name}
          />
          <AvatarFallback>{post.user.display_name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.user.display_name}</h3>
          <p className="text-sm text-muted-foreground">@{post.user.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          {post.shares}
        </Button>
      </CardFooter>
    </Card>
  );
}
