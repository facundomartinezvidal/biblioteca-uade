import { createTRPCRouter, publicProcedure } from "../trpc";
import type { RouterInput, RouterOutput } from "../root";
import { authors, books, genders } from "~/server/db/schemas";
import { eq, or, ilike, and, count, gte, lte } from "drizzle-orm";
import { z } from "zod";

export type getAllBooksInput = RouterInput["books"]["getAll"];
export type getAllBooksOutput = RouterOutput["books"]["getAll"];
export type getByIdBooksInput = RouterInput["books"]["getById"];
export type getByIdBooksOutput = RouterOutput["books"]["getById"];

export const booksRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        genre: z.string().optional(),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "RESERVED"]).optional(),
        editorial: z.string().optional(),
        yearFrom: z.number().min(1800).max(2030).optional(),
        yearTo: z.number().min(1800).max(2030).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        search,
        genre,
        status,
        editorial,
        yearFrom,
        yearTo,
        page,
        limit,
      } = input;
      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      if (search) {
        const searchTerm = search.trim();

        conditions.push(
          or(
            ilike(books.title, `%${searchTerm}%`),
            ilike(books.description, `%${searchTerm}%`),
            ilike(books.isbn, `%${searchTerm}%`),
            ilike(authors.name, `%${searchTerm}%`),
            ilike(authors.middleName, `%${searchTerm}%`),
            ilike(authors.lastName, `%${searchTerm}%`),
          ),
        );
      }

      if (genre) {
        conditions.push(ilike(genders.name, `%${genre}%`));
      }

      if (status) {
        conditions.push(eq(books.status, status));
      }

      if (editorial) {
        conditions.push(ilike(books.editorial, `%${editorial}%`));
      }

      if (yearFrom) {
        conditions.push(gte(books.year, yearFrom));
      }

      if (yearTo) {
        conditions.push(lte(books.year, yearTo));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(books)
        .innerJoin(authors, eq(books.authorId, authors.id))
        .innerJoin(genders, eq(books.genderId, genders.id))
        .where(whereClause);

      const totalCount = totalCountResult[0]?.count ?? 0;

      // Get paginated results
      const allBooks = await ctx.db
        .select({
          id: books.id,
          title: books.title,
          description: books.description,
          isbn: books.isbn,
          status: books.status,
          author: authors.name,
          authorMiddleName: authors.middleName,
          authorLastName: authors.lastName,
          year: books.year,
          editorial: books.editorial,
          gender: genders.name,
          location: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .innerJoin(authors, eq(books.authorId, authors.id))
        .innerJoin(genders, eq(books.genderId, genders.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        method: "GET",
        response: allBooks,
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const book = await ctx.db
        .select({
          id: books.id,
          title: books.title,
          description: books.description,
          isbn: books.isbn,
          status: books.status,
          author: authors.name,
          authorMiddleName: authors.middleName,
          authorLastName: authors.lastName,
          year: books.year,
          editorial: books.editorial,
          gender: genders.name,
          location: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .where(eq(books.id, input.id))
        .innerJoin(authors, eq(books.authorId, authors.id))
        .innerJoin(genders, eq(books.genderId, genders.id));
      return {
        success: true,
        method: "GET",
        response: book,
      };
    }),
});
