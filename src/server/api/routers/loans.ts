import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { loans } from "~/server/db/schemas/loans";
import { books } from "~/server/db/schemas/books";
import { authors } from "~/server/db/schemas/authors";
import { genders } from "~/server/db/schemas/genders";
import { locations } from "~/server/db/schemas/locations";
import { editorials } from "~/server/db/schemas/editorials";
import { users } from "~/server/db/schemas/users";
import { roles } from "~/server/db/schemas/roles";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Middleware para verificar rol de admin
const enforceUserIsAdmin = protectedProcedure.use(async ({ ctx, next }) => {
  const userWithRole = await ctx.db
    .select({
      rol: roles.nombre_rol,
    })
    .from(users)
    .where(eq(users.id, ctx.user.id))
    .innerJoin(roles, eq(users.id_rol, roles.id_rol))
    .limit(1);

  if (!userWithRole[0] || userWithRole[0].rol === "estudiante") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No tienes permisos para acceder a este recurso",
    });
  }

  return next({ ctx });
});

export const loansRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z
          .enum(["RESERVED", "ACTIVE", "FINISHED", "EXPIRED", "CANCELLED"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const whereConditions = input.status
        ? and(eq(loans.userId, userId), eq(loans.status, input.status))
        : eq(loans.userId, userId);

      const results = await ctx.db
        .select({
          id: loans.id,
          userId: loans.userId,
          endDate: loans.endDate,
          status: loans.status,
          createdAt: loans.createdAt,
          book: {
            id: books.id,
            title: books.title,
            description: books.description,
            isbn: books.isbn,
            status: books.status,
            year: books.year,
            imageUrl: books.imageUrl,
            createdAt: books.createdAt,
          },
          author: {
            id: authors.id,
            name: authors.name,
            middleName: authors.middleName,
            lastName: authors.lastName,
            createdAt: authors.createdAt,
          },
          gender: {
            id: genders.id,
            name: genders.name,
            createdAt: genders.createdAt,
          },
          location: {
            id: locations.id,
            address: locations.address,
            campus: locations.campus,
          },
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(loans.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: loans.id })
        .from(loans)
        .where(whereConditions);

      const formattedResults = results.map((result) => ({
        ...result,
        book: {
          ...result.book,
          editorial: result.editorial ?? "",
        },
      }));

      return {
        results: formattedResults,
        total: totalResults.length,
        page: input.page,
        limit: input.limit,
      };
    }),

  getActive: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const results = await ctx.db
      .select({
        id: loans.id,
        userId: loans.userId,
        endDate: loans.endDate,
        status: loans.status,
        createdAt: loans.createdAt,
        book: {
          id: books.id,
          title: books.title,
          description: books.description,
          isbn: books.isbn,
          status: books.status,
          year: books.year,
          imageUrl: books.imageUrl,
          createdAt: books.createdAt,
        },
        author: {
          id: authors.id,
          name: authors.name,
          middleName: authors.middleName,
          lastName: authors.lastName,
          createdAt: authors.createdAt,
        },
        gender: {
          id: genders.id,
          name: genders.name,
          createdAt: genders.createdAt,
        },
        location: {
          id: locations.id,
          address: locations.address,
          campus: locations.campus,
        },
        editorial: editorials.name,
      })
      .from(loans)
      .innerJoin(books, eq(loans.bookId, books.id))
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(genders, eq(books.genderId, genders.id))
      .leftJoin(locations, eq(books.locationId, locations.id))
      .leftJoin(editorials, eq(books.editorialId, editorials.id))
      .where(and(eq(loans.userId, userId), eq(loans.status, "ACTIVE")))
      .orderBy(desc(loans.createdAt));

    const formattedResults = results.map((result) => ({
      ...result,
      book: {
        ...result.book,
        editorial: result.editorial ?? "",
      },
    }));

    return {
      results: formattedResults,
      total: formattedResults.length,
    };
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: loans.id,
          userId: loans.userId,
          endDate: loans.endDate,
          status: loans.status,
          createdAt: loans.createdAt,
          book: {
            id: books.id,
            title: books.title,
            description: books.description,
            isbn: books.isbn,
            status: books.status,
            year: books.year,
            imageUrl: books.imageUrl,
            createdAt: books.createdAt,
          },
          author: {
            id: authors.id,
            name: authors.name,
            middleName: authors.middleName,
            lastName: authors.lastName,
            createdAt: authors.createdAt,
          },
          gender: {
            id: genders.id,
            name: genders.name,
            createdAt: genders.createdAt,
          },
          location: {
            id: locations.id,
            address: locations.address,
            campus: locations.campus,
          },
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(eq(loans.id, input.id))
        .limit(1);

      if (result.length === 0) return null;

      return {
        ...result[0],
        book: {
          ...result[0]!.book,
          editorial: result[0]!.editorial ?? "",
        },
      };
    }),

  cancelReservation: protectedProcedure
    .input(z.object({ loanId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existingLoan = await ctx.db
        .select()
        .from(loans)
        .where(and(eq(loans.id, input.loanId), eq(loans.userId, userId)))
        .limit(1);

      if (existingLoan.length === 0) {
        throw new Error("Préstamo no encontrado o no autorizado");
      }

      if (existingLoan[0]!.status !== "RESERVED") {
        throw new Error("Solo se pueden cancelar reservas en estado RESERVED");
      }

      await ctx.db
        .update(loans)
        .set({ status: "CANCELLED" })
        .where(eq(loans.id, input.loanId));

      const bookId = existingLoan[0]!.bookId;
      await ctx.db
        .update(books)
        .set({ status: "AVAILABLE" })
        .where(eq(books.id, bookId));

      return { success: true };
    }),

  createReservation: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const book = await ctx.db
        .select()
        .from(books)
        .where(eq(books.id, input.bookId))
        .limit(1);

      if (book.length === 0) {
        throw new Error("Libro no encontrado");
      }

      if (book[0]!.status !== "AVAILABLE") {
        throw new Error("El libro no está disponible para reserva");
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7);

      const newLoan = await ctx.db
        .insert(loans)
        .values({
          bookId: input.bookId,
          userId: userId,
          status: "RESERVED",
          createdAt: now.toISOString(),
          endDate: endDate.toISOString(),
        })
        .returning();

      await ctx.db
        .update(books)
        .set({ status: "RESERVED" })
        .where(eq(books.id, input.bookId));

      return { success: true, loan: newLoan[0] };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const allLoans = await ctx.db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId));

    const activeLoans = allLoans.filter(
      (loan) => loan.status === "ACTIVE" || loan.status === "RESERVED",
    ).length;

    const finishedLoans = allLoans.filter(
      (loan) => loan.status === "FINISHED",
    ).length;

    const now = new Date();
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);

    const upcomingDue = allLoans.filter((loan) => {
      if (loan.status !== "ACTIVE" && loan.status !== "RESERVED") return false;
      const endDate = new Date(loan.endDate);
      return endDate >= now && endDate <= twoDaysFromNow;
    }).length;

    return {
      activeLoans,
      finishedLoans,
      pendingFines: 0,
      upcomingDue,
    };
  }),

  getByUserIdAdmin: enforceUserIsAdmin
    .input(
      z.object({
        userId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z
          .enum(["RESERVED", "ACTIVE", "FINISHED", "EXPIRED", "CANCELLED"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const whereConditions = input.status
        ? and(eq(loans.userId, input.userId), eq(loans.status, input.status))
        : eq(loans.userId, input.userId);

      const results = await ctx.db
        .select({
          id: loans.id,
          userId: loans.userId,
          endDate: loans.endDate,
          status: loans.status,
          createdAt: loans.createdAt,
          book: {
            id: books.id,
            title: books.title,
            description: books.description,
            isbn: books.isbn,
            status: books.status,
            year: books.year,
            imageUrl: books.imageUrl,
            createdAt: books.createdAt,
          },
          author: {
            id: authors.id,
            name: authors.name,
            middleName: authors.middleName,
            lastName: authors.lastName,
            createdAt: authors.createdAt,
          },
          gender: {
            id: genders.id,
            name: genders.name,
            createdAt: genders.createdAt,
          },
          location: {
            id: locations.id,
            address: locations.address,
            campus: locations.campus,
          },
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(loans.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: loans.id })
        .from(loans)
        .where(whereConditions);

      const formattedResults = results.map((result) => ({
        ...result,
        book: {
          ...result.book,
          editorial: result.editorial ?? "",
        },
      }));

      return {
        results: formattedResults,
        total: totalResults.length,
        page: input.page,
        limit: input.limit,
      };
    }),
});
