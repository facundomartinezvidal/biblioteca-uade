import { createTRPCRouter, publicProcedure } from "../trpc";
import type { RouterInput, RouterOutput } from "../root";
import { authors, books, genders } from "~/server/db/schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type getAllBooksInput = RouterInput["books"]["getAll"];
export type getAllBooksOutput = RouterOutput["books"]["getAll"];
export type getByIdBooksInput = RouterInput["books"]["getById"];
export type getByIdBooksOutput = RouterOutput["books"]["getById"];

export const booksRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
      .innerJoin(genders, eq(books.genderId, genders.id));
    return {
      success: true,
      method: "GET",
      response: allBooks,
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
