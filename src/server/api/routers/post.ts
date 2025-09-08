import { desc } from "drizzle-orm";
import { z } from "zod";
import { posts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  // Get all published posts
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          author: posts.author,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(5);
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
});
