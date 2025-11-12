import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import type { RouterInput, RouterOutput } from "../root";
import {
  authors,
  books,
  editorials,
  genders,
  locations,
} from "~/server/db/schemas";
import { loans } from "~/server/db/schemas/loans";
import { eq, or, ilike, and, count, gte, lte, inArray, desc } from "drizzle-orm";
import { z } from "zod";

const normalizeText = (text: string | null | undefined) =>
  (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const STOP_WORDS = new Set([
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "de",
  "del",
  "al",
  "y",
  "en",
  "a",
  "con",
  "por",
  "para",
  "sobre",
  "sin",
  "the",
  "of",
  "and",
]);

const normalizeToken = (token: string) => {
  let base = normalizeText(token).replace(/[^a-z0-9\s]/g, "");
  if (base.length > 4 && base.endsWith("es")) {
    base = base.slice(0, -2);
  } else if (base.length > 3 && base.endsWith("s")) {
    base = base.slice(0, -1);
  }
  return base;
};

const tokenize = (text: string | null | undefined) => {
  if (!text) return [];
  return normalizeText(text)
    .split(/\s+/)
    .map((token) => normalizeToken(token))
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
};

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
        locationId: z.string().optional(),
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
        locationId,
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
        conditions.push(eq(books.genderId, genre));
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
        conditions.push(eq(books.editorialId, editorial));
      }

      if (locationId) {
        conditions.push(eq(books.locationId, locationId));
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
        .leftJoin(locations, eq(books.locationId, locations.id))
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
          location: locations.address,
          locationCampus: locations.campus,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
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
  getRecommended: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(20).default(6),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 6;
      const userId = ctx.user.id;

      const userLoans = await ctx.db
        .select({
          bookId: loans.bookId,
          authorId: books.authorId,
          genderId: books.genderId,
          editorialId: books.editorialId,
          title: books.title,
          description: books.description,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .where(eq(loans.userId, userId));

      const loanedBookIds = new Set(userLoans.map((loan) => loan.bookId));

      const increment = (
        map: Map<string, number>,
        key: string | null | undefined,
      ) => {
        if (!key) return;
        map.set(key, (map.get(key) ?? 0) + 1);
      };

      const authorCounts = new Map<string, number>();
      const genderCounts = new Map<string, number>();
      const editorialCounts = new Map<string, number>();
      const titleTokenCounts = new Map<string, number>();

      for (const loan of userLoans) {
        increment(authorCounts, loan.authorId);
        increment(genderCounts, loan.genderId);
        increment(editorialCounts, loan.editorialId);
        const tokens = new Set([
          ...tokenize(loan.title),
          ...tokenize(loan.description),
        ]);
        tokens.forEach((token) => increment(titleTokenCounts, token));
      }

      const hasPreferences =
        authorCounts.size > 0 ||
        genderCounts.size > 0 ||
        editorialCounts.size > 0 ||
        titleTokenCounts.size > 0;

      const baseSelect = ctx.db
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
          location: locations.address,
          locationCampus: locations.campus,
          locationId: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .where(eq(books.status, "AVAILABLE"))
        .orderBy(desc(books.createdAt));

      if (!hasPreferences) {
        const fallbackBooks = await baseSelect.limit(limit * 2);
        const uniqueFallback = fallbackBooks.filter(
          (book) => !loanedBookIds.has(book.id),
        );

        return {
          success: true,
          method: "GET",
          response: uniqueFallback.slice(0, limit),
        };
      }

      const candidateLimit = Math.max(limit * 4, 32);
      const candidateBooks = await baseSelect.limit(candidateLimit);

      if (candidateBooks.length === 0) {
        return {
          success: true,
          method: "GET",
          response: [],
        };
      }

      const maxAuthorCount =
        authorCounts.size === 0
          ? 0
          : Math.max(...Array.from(authorCounts.values()));
      const maxGenderCount =
        genderCounts.size === 0
          ? 0
          : Math.max(...Array.from(genderCounts.values()));
      const maxEditorialCount =
        editorialCounts.size === 0
          ? 0
          : Math.max(...Array.from(editorialCounts.values()));
      const maxTitleTokenCount =
        titleTokenCounts.size === 0
          ? 0
          : Math.max(...Array.from(titleTokenCounts.values()));

      const sortedBooks = candidateBooks
        .filter((book) => !loanedBookIds.has(book.id))
        .map((book) => {
          const computeWeightedScore = (
            map: Map<string, number>,
            key: string | null,
            weight: number,
            maxCount: number,
          ) => {
            if (!key) return 0;
            const count = map.get(key) ?? 0;
            if (count === 0 || maxCount === 0) return 0;
            return weight * (count / maxCount);
          };

          const authorScore = computeWeightedScore(
            authorCounts,
            book.authorId,
            3,
            maxAuthorCount,
          );
          const genderScore = computeWeightedScore(
            genderCounts,
            book.genderId,
            2,
            maxGenderCount,
          );
          const editorialScore = computeWeightedScore(
            editorialCounts,
            book.editorialId,
            1,
            maxEditorialCount,
          );
          const tokens = new Set([
            ...tokenize(book.title),
            ...tokenize(book.description),
          ]);
          let tokenScore = 0;
          if (tokens.size > 0 && maxTitleTokenCount > 0) {
            for (const token of tokens) {
              const count = titleTokenCounts.get(token) ?? 0;
              if (count > 0) {
                tokenScore += count / maxTitleTokenCount;
              }
            }
            tokenScore *= 1.5;
          }

          const score =
            authorScore + genderScore + editorialScore + tokenScore;

          return {
            ...book,
            score,
          };
        })
        .sort((a, b) => {
          if (b.score === a.score) {
            return (
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
            );
          }
          return b.score - a.score;
        });

      const recommendedBooks = sortedBooks
        .filter((book) => book.score > 0)
        .slice(0, limit);

      if (recommendedBooks.length < limit) {
        const fallbackCandidates = sortedBooks
          .filter((book) => book.score === 0)
          .sort((a, b) => {
            const dateDiff =
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime();
            if (dateDiff !== 0) return dateDiff;
            return b.title.localeCompare(a.title);
          });

        for (const book of fallbackCandidates) {
          if (recommendedBooks.length >= limit) break;
          if (recommendedBooks.some((selected) => selected.id === book.id))
            continue;
          recommendedBooks.push(book);
        }
      }

      const sanitizedBooks = recommendedBooks.slice(0, limit).map((book) => ({
        id: book.id,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        status: book.status,
        author: book.author,
        authorMiddleName: book.authorMiddleName,
        authorLastName: book.authorLastName,
        year: book.year,
        editorial: book.editorial,
        gender: book.gender,
        location: book.location,
        locationCampus: book.locationCampus,
        locationId: book.locationId,
        imageUrl: book.imageUrl,
      }));

      return {
        success: true,
        method: "GET",
        response: sanitizedBooks,
      };
    }),
  getAllAdmin: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "RESERVED"]).optional(),
        locationId: z.string().optional(),
        genre: z.string().optional(),
        editorial: z.string().optional(),
        yearFrom: z.number().optional(),
        yearTo: z.number().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, status, locationId, genre, editorial, yearFrom, yearTo, page, limit } = input;
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

      if (locationId) {
        conditions.push(eq(books.locationId, locationId));
      }

      if (genre) {
        conditions.push(eq(books.genderId, genre));
      }

      if (editorial) {
        conditions.push(eq(books.editorialId, editorial));
      }

      if (yearFrom) {
        conditions.push(gte(books.year, yearFrom));
      }

      if (yearTo) {
        conditions.push(lte(books.year, yearTo));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
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
          location: locations.address,
          locationCampus: locations.campus,
          locationId: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
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
          location: locations.address,
          locationCampus: locations.campus,
          locationId: books.locationId,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        })
        .from(books)
        .where(eq(books.id, input.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id));
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
