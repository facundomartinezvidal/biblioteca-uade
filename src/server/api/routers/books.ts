import { createTRPCRouter, publicProcedure } from "../trpc";
import type { RouterInput, RouterOutput } from "../root";
import { authors, books, editorials, genders } from "~/server/db/schemas";
import { loans } from "~/server/db/schemas/loans";
import { eq, or, ilike, and, count, gte, lte, inArray } from "drizzle-orm";
import { z } from "zod";

export type getAllBooksInput = RouterInput["books"]["getAll"];
export type getAllBooksOutput = RouterOutput["books"]["getAll"];
export type getByIdBooksInput = RouterInput["books"]["getById"];
export type getByIdBooksOutput = RouterOutput["books"]["getById"];
export type getAllAdminBooksInput = RouterInput["books"]["getAllAdmin"];
export type getAllAdminBooksOutput = RouterOutput["books"]["getAllAdmin"];

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

      // Filtro especial para RESERVED: solo mostrar libros reservados por el usuario actual
      if (status === "RESERVED") {
        if (!ctx.user) {
          // Si no hay usuario autenticado, no mostrar resultados
          return {
            success: true,
            method: "GET",
            response: [],
            pagination: {
              page,
              limit,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }

        // Obtener IDs de libros reservados por el usuario
        const userReservedLoans = await ctx.db
          .select({ bookId: loans.bookId })
          .from(loans)
          .where(
            and(
              eq(loans.userId, ctx.user.id),
              or(eq(loans.status, "RESERVED"), eq(loans.status, "ACTIVE")),
            ),
          );

        const reservedBookIds = userReservedLoans.map((loan) => loan.bookId);

        if (reservedBookIds.length === 0) {
          // Usuario no tiene libros reservados
          return {
            success: true,
            method: "GET",
            response: [],
            pagination: {
              page,
              limit,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }

        // Agregar condición para filtrar solo por estos IDs
        conditions.push(inArray(books.id, reservedBookIds));
      } else if (status) {
        conditions.push(eq(books.status, status));
      }

      if (editorial) {
        conditions.push(ilike(editorials.name, `%${editorial}%`));
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
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
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
          editorial: editorials.name,
          gender: genders.name,
          location: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
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
  getAllAdmin: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "RESERVED"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, status, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (search) {
        const searchTerm = search.trim();
        conditions.push(
          or(
            ilike(books.title, `%${searchTerm}%`),
            ilike(books.isbn, `%${searchTerm}%`),
            ilike(authors.name, `%${searchTerm}%`),
            ilike(authors.lastName, `%${searchTerm}%`),
          ),
        );
      }

      if (status) {
        conditions.push(eq(books.status, status));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .where(whereClause);

      const totalCount = totalCountResult[0]?.count ?? 0;

      const allBooks = await ctx.db
        .select({
          id: books.id,
          title: books.title,
          isbn: books.isbn,
          description: books.description,
          status: books.status,
          author: authors.name,
          authorMiddleName: authors.middleName,
          authorLastName: authors.lastName,
          authorId: books.authorId,
          year: books.year,
          editorial: editorials.name,
          editorialId: books.editorialId,
          gender: genders.name,
          genderId: books.genderId,
          location: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
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
          authorId: books.authorId,
          year: books.year,
          editorial: editorials.name,
          editorialId: books.editorialId,
          gender: genders.name,
          genderId: books.genderId,
          location: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .where(eq(books.id, input.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id));
      return {
        success: true,
        method: "GET",
        response: book,
      };
    }),
  updateBook: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        isbn: z
          .string()
          .regex(/^[0-9]{10}$|^[0-9]{13}$/,{ message: "El ISBN debe tener 10 o 13 dígitos numéricos" }),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "RESERVED"]),
        year: z.number().min(1800).max(2030).optional(),
        editorialId: z.string().optional(),
        authorId: z.string().optional(),
        genderId: z.string().optional(),
        locationId: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const updatedBook = await ctx.db
        .update(books)
        .set(updateData)
        .where(eq(books.id, id))
        .returning();

      return {
        success: true,
        method: "PUT",
        response: updatedBook[0],
      };
    }),
  deleteBook: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(books).where(eq(books.id, input.id));

      return {
        success: true,
        method: "DELETE",
        message: "Book deleted successfully",
      };
    }),

  createBook: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string().optional(),
        isbn: z
          .string()
          .regex(/^[0-9]{10}$|^[0-9]{13}$/,{ message: "El ISBN debe ser numérico y contener exactamente 10 o 13 dígitos" }),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "RESERVED"]).optional(),
        year: z.number().min(1800).max(2030).optional(),
        editorialId: z.string().optional(),
        authorId: z.string().optional(),
        genderId: z.string().optional(),
        locationId: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newBook = await ctx.db
        .insert(books)
        .values({
          ...input,
          status: input.status ?? "AVAILABLE",
          createdAt: new Date().toISOString(),
        })
        .returning();

      return {
        success: true,
        method: "POST",
        response: newBook[0],
      };
    }),
});
