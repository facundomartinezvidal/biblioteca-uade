"use client";

import { api } from "~/trpc/react";
import PostCard from "./post-card";
import { TRPCIcon } from "~/components/icons/icons/trpc-icon";

export default function PostsDemo() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <TRPCIcon className="mx-auto mb-4 h-12 w-12 text-white" />
        <h2 className="mb-4 text-3xl font-bold text-white">tRPC Demo</h2>
        <p className="mx-auto max-w-2xl text-lg text-white/70">
          Create and view posts using tRPC with full type safety
        </p>
      </div>

      <div className="grid gap-8">{/* Posts List */}</div>
    </div>
  );
}
