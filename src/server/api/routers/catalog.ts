import { createTRPCRouter, publicProcedure } from "../trpc";
import { authors, editorials, genders, locations } from "~/server/db/schemas";
import { z } from "zod";
import { eq, or, ilike, count } from "drizzle-orm";

export const catalogRouter = createTRPCRouter({
  getAllAuthors: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { search, page = 1, limit = 10 } = input ?? {};
      const offset = (page - 1) * limit;

      // Build where condition
      const whereCondition = search
        ? or(
            ilike(authors.name, `%${search}%`),
            ilike(authors.middleName, `%${search}%`),
            ilike(authors.lastName, `%${search}%`),
          )
        : undefined;

      // Get total count
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(authors)
        .where(whereCondition);
      const totalCount = totalCountResult[0]?.count ?? 0;

      // Get paginated results
      const allAuthors = await ctx.db
        .select()
        .from(authors)
        .where(whereCondition)
        .limit(limit)
        .offset(offset)
        .orderBy(authors.lastName, authors.name);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        method: "GET",
        response: allAuthors,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }),

  getAllGenders: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { search, page = 1, limit = 10 } = input ?? {};
      const offset = (page - 1) * limit;

      // Build where condition
      const whereCondition = search
        ? ilike(genders.name, `%${search}%`)
        : undefined;

      // Get total count
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(genders)
        .where(whereCondition);
      const totalCount = totalCountResult[0]?.count ?? 0;

      // Get paginated results
      const allGenders = await ctx.db
        .select()
        .from(genders)
        .where(whereCondition)
        .limit(limit)
        .offset(offset)
        .orderBy(genders.name);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        method: "GET",
        response: allGenders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
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

  getAllEditorials: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { search, page = 1, limit = 10 } = input ?? {};
      const offset = (page - 1) * limit;

      // Build where condition
      const whereCondition = search
        ? ilike(editorials.name, `%${search}%`)
        : undefined;

      // Get total count
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(editorials)
        .where(whereCondition);
      const totalCount = totalCountResult[0]?.count ?? 0;

      // Get paginated results
      const allEditorials = await ctx.db
        .select()
        .from(editorials)
        .where(whereCondition)
        .limit(limit)
        .offset(offset)
        .orderBy(editorials.name);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        method: "GET",
        response: allEditorials,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
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

  getAllLocations: publicProcedure.query(async ({ ctx }) => {
    const allLocations = await ctx.db.select().from(locations);

    return {
      success: true,
      method: "GET",
      response: allLocations,
    };
  }),
});
