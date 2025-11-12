import { createTRPCRouter, publicProcedure } from "../trpc";
import { authors, editorials, genders } from "~/server/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";

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
  updateAuthor: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        middleName: z.string().optional().nullable(),
        lastName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updated = await ctx.db
        .update(authors)
        .set(data)
        .where(eq(authors.id, id))
        .returning();
      return {
        success: true,
        method: "PUT",
        response: updated[0],
      };
    }),
  deleteAuthor: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(authors).where(eq(authors.id, input.id));
      return {
        success: true,
        method: "DELETE",
        message: "Author deleted successfully",
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
  updateGender: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      const updated = await ctx.db
        .update(genders)
        .set({ name })
        .where(eq(genders.id, id))
        .returning();
      return {
        success: true,
        method: "PUT",
        response: updated[0],
      };
    }),
  deleteGender: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(genders).where(eq(genders.id, input.id));
      return {
        success: true,
        method: "DELETE",
        message: "Gender deleted successfully",
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
  updateEditorial: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      const updated = await ctx.db
        .update(editorials)
        .set({ name })
        .where(eq(editorials.id, id))
        .returning();
      return {
        success: true,
        method: "PUT",
        response: updated[0],
      };
    }),
  deleteEditorial: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(editorials).where(eq(editorials.id, input.id));
      return {
        success: true,
        method: "DELETE",
        message: "Editorial deleted successfully",
      };
    }),
});
