import { createTRPCRouter, publicProcedure } from "../trpc";
import { authors, editorials, genders } from "~/server/db/schemas";
import { z } from "zod";

export const catalogRouter = createTRPCRouter({
  getAllAuthors: publicProcedure.query(async ({ ctx }) => {
    const allAuthors = await ctx.db.select().from(authors);

    return {
      success: true,
      method: "GET",
      response: allAuthors,
    };
  }),
  getAllGenders: publicProcedure.query(async ({ ctx }) => {
    const allGenders = await ctx.db.select().from(genders);

    return {
      success: true,
      method: "GET",
      response: allGenders,
    };
  }),

  createAuthor: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        middleName: z.string().optional(),
        lastName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newAuthor = await ctx.db
        .insert(authors)
        .values({
          ...input,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return {
        success: true,
        method: "POST",
        response: newAuthor[0],
      };
    }),

  createGender: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newGender = await ctx.db
        .insert(genders)
        .values({
          ...input,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return {
        success: true,
        method: "POST",
        response: newGender[0],
      };
    }),

  getAllEditorials: publicProcedure.query(async ({ ctx }) => {
    const allEditorials = await ctx.db.select().from(editorials);

    return {
      success: true,
      method: "GET",
      response: allEditorials,
    };
  }),

  createEditorial: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newEditorial = await ctx.db
        .insert(editorials)
        .values({
          ...input,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return {
        success: true,
        method: "POST",
        response: newEditorial[0],
      };
    }),
});
