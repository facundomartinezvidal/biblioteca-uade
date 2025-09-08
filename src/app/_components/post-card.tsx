"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Loader2, Calendar, User, Edit3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  content: string | null;
  author: string;
  createdAt: Date;
}

interface PostCardProps {
  posts: Post[] | null;
  isLoading: boolean;
}

export default function PostCard({ posts, isLoading }: PostCardProps) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Edit3 className="h-5 w-5" />
          Recent Posts
        </CardTitle>
        <CardDescription className="text-white/70">
          Posts list fetched via tRPC
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-lg font-semibold text-white">
                    {post.title}
                  </h4>
                </div>

                {post.content && (
                  <p className="mb-3 line-clamp-3 text-white/70">
                    {post.content}
                  </p>
                )}

                <Separator className="my-3 bg-white/10" />

                <div className="flex items-center justify-between text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: enUS,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Edit3 className="mx-auto mb-4 h-12 w-12 text-white/30" />
            <p className="text-white/50">No posts yet. Create the first one!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
