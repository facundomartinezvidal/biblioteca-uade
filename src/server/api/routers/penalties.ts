import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { penalties } from "~/server/db/schemas/penalties";
import { sanctions } from "~/server/db/schemas/sanctions";
import { loans } from "~/server/db/schemas/loans";
import { books } from "~/server/db/schemas/books";
import { authors } from "~/server/db/schemas/authors";
import { genders } from "~/server/db/schemas/genders";
import { editorials } from "~/server/db/schemas/editorials";
import { eq, and, desc, or, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Middleware para verificar rol de admin
const enforceUserIsAdmin = protectedProcedure.use(async ({ ctx, next }) => {
  const userRole = ctx.user.role?.toUpperCase();
  const userSubrol = ctx.user.subrol?.toUpperCase();

  // Only ADMINISTRADOR with BIBLIOTECARIO subrol can access
  if (userRole !== "ADMINISTRADOR" || userSubrol !== "BIBLIOTECARIO") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No tienes permisos para acceder a este recurso",
    });
  }

  return next({ ctx });
});

export const penaltiesRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.enum(["PENDING", "PAID", "EXPIRED"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(penalties.userId, userId)];

      if (input.status) {
        conditions.push(eq(penalties.status, input.status));
      }

      if (input.search) {
        const searchTerm = input.search.trim();
        conditions.push(
          or(
            ilike(books.title, `%${searchTerm}%`),
            ilike(books.isbn, `%${searchTerm}%`),
            ilike(authors.name, `%${searchTerm}%`),
            ilike(authors.middleName, `%${searchTerm}%`),
            ilike(authors.lastName, `%${searchTerm}%`),
          )!,
        );
      }

      const whereConditions = and(...conditions);

      const results = await ctx.db
        .select({
          id: penalties.id,
          userId: penalties.userId,
          loanId: penalties.loanId,
          sanctionId: penalties.sanctionId,
          amount: sanctions.amount,
          status: penalties.status,
          createdAt: penalties.createdAt,
          expiresIn: penalties.expiresIn,
          sanction: {
            id: sanctions.id,
            name: sanctions.name,
            type: sanctions.type,
            description: sanctions.description,
            amount: sanctions.amount,
          },
          loan: {
            id: loans.id,
            endDate: loans.endDate,
            status: loans.status,
            createdAt: loans.createdAt,
          },
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
        .from(penalties)
        .leftJoin(sanctions, eq(penalties.sanctionId, sanctions.id))
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(penalties.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: penalties.id })
        .from(penalties)
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
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

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.enum(["PENDING", "PAID", "EXPIRED"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const whereConditions = input.status
        ? and(eq(penalties.userId, userId), eq(penalties.status, input.status))
        : eq(penalties.userId, userId);

      const results = await ctx.db
        .select({
          id: penalties.id,
          userId: penalties.userId,
          loanId: penalties.loanId,
          sanctionId: penalties.sanctionId,
          amount: sanctions.amount,
          status: penalties.status,
          createdAt: penalties.createdAt,
          expiresIn: penalties.expiresIn,
          sanction: {
            id: sanctions.id,
            name: sanctions.name,
            type: sanctions.type,
            description: sanctions.description,
            amount: sanctions.amount,
          },
          loan: {
            id: loans.id,
            endDate: loans.endDate,
            status: loans.status,
            createdAt: loans.createdAt,
          },
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
        .from(penalties)
        .leftJoin(sanctions, eq(penalties.sanctionId, sanctions.id))
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(penalties.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: penalties.id })
        .from(penalties)
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

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: penalties.id,
          userId: penalties.userId,
          loanId: penalties.loanId,
          sanctionId: penalties.sanctionId,
          amount: sanctions.amount,
          status: penalties.status,
          createdAt: penalties.createdAt,
          expiresIn: penalties.expiresIn,
          sanction: {
            id: sanctions.id,
            name: sanctions.name,
            type: sanctions.type,
            description: sanctions.description,
            amount: sanctions.amount,
          },
          loan: {
            id: loans.id,
            endDate: loans.endDate,
            status: loans.status,
            createdAt: loans.createdAt,
          },
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
        .from(penalties)
        .leftJoin(sanctions, eq(penalties.sanctionId, sanctions.id))
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(eq(penalties.id, input.id))
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

  markAsPaid: protectedProcedure
    .input(z.object({ penaltyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existingPenalty = await ctx.db
        .select()
        .from(penalties)
        .where(
          and(eq(penalties.id, input.penaltyId), eq(penalties.userId, userId)),
        )
        .limit(1);

      if (existingPenalty.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Multa no encontrada o no autorizada",
        });
      }

      if (existingPenalty[0]!.status === "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Esta multa ya fue pagada",
        });
      }

      await ctx.db
        .update(penalties)
        .set({ status: "PAID" })
        .where(eq(penalties.id, input.penaltyId));

      return { success: true };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const allPenalties = await ctx.db
      .select({
        id: penalties.id,
        sanctionId: penalties.sanctionId,
        userId: penalties.userId,
        loanId: penalties.loanId,
        status: penalties.status,
        createdAt: penalties.createdAt,
        expiresIn: penalties.expiresIn,
        sanctionAmount: sanctions.amount,
      })
      .from(penalties)
      .leftJoin(sanctions, eq(penalties.sanctionId, sanctions.id))
      .where(eq(penalties.userId, userId));

    const pendingPenalties = allPenalties.filter(
      (penalty) => penalty.status === "PENDING",
    ).length;

    const paidPenalties = allPenalties.filter(
      (penalty) => penalty.status === "PAID",
    ).length;

    const totalAmount = allPenalties.reduce((sum, penalty) => {
      return (
        sum +
        (penalty.status !== "PAID"
          ? parseFloat(penalty.sanctionAmount ?? "0")
          : 0)
      );
    }, 0);

    const now = new Date();
    const expiringSoon = allPenalties.filter((penalty) => {
      if (penalty.status === "PAID" || !penalty.expiresIn) return false;
      const expirationDate = new Date(penalty.expiresIn);
      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(now.getDate() + 3);
      return expirationDate >= now && expirationDate <= threeDaysFromNow;
    }).length;

    return {
      pendingPenalties,
      paidPenalties,
      totalAmount,
      expiringSoon,
    };
  }),

  getByUserIdAdmin: enforceUserIsAdmin
    .input(
      z.object({
        userId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.enum(["PENDING", "PAID", "EXPIRED"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(penalties.userId, input.userId)];

      if (input.status) {
        conditions.push(eq(penalties.status, input.status));
      }

      if (input.search) {
        const searchTerm = input.search.trim();
        conditions.push(
          or(
            ilike(books.title, `%${searchTerm}%`),
            ilike(books.isbn, `%${searchTerm}%`),
            ilike(authors.name, `%${searchTerm}%`),
            ilike(authors.middleName, `%${searchTerm}%`),
            ilike(authors.lastName, `%${searchTerm}%`),
          )!,
        );
      }

      const whereConditions = and(...conditions);

      const results = await ctx.db
        .select({
          id: penalties.id,
          userId: penalties.userId,
          loanId: penalties.loanId,
          sanctionId: penalties.sanctionId,
          amount: sanctions.amount,
          status: penalties.status,
          createdAt: penalties.createdAt,
          expiresIn: penalties.expiresIn,
          sanction: {
            id: sanctions.id,
            name: sanctions.name,
            type: sanctions.type,
            description: sanctions.description,
            amount: sanctions.amount,
          },
          loan: {
            id: loans.id,
            endDate: loans.endDate,
            status: loans.status,
            createdAt: loans.createdAt,
          },
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
        .from(penalties)
        .leftJoin(sanctions, eq(penalties.sanctionId, sanctions.id))
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(locations, eq(books.locationId, locations.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(penalties.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: penalties.id })
        .from(penalties)
        .innerJoin(loans, eq(penalties.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
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
