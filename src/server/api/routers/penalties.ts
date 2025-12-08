import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { userParameters } from "~/server/db/schemas/user-parameters";
import { loans } from "~/server/db/schemas/loans";
import { books } from "~/server/db/schemas/books";
import { authors } from "~/server/db/schemas/authors";
import { genders } from "~/server/db/schemas/genders";
import { editorials } from "~/server/db/schemas/editorials";
import { eq, and, desc, or, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  getLocationFromBackoffice,
  getAllParametersFromBackoffice,
} from "~/lib/backoffice-api";

/**
 * Helper function to enrich user parameters with location and parameter data
 */
async function enrichUserParametersWithData<
  T extends {
    locationId: string | null;
    book: Record<string, unknown>;
    editorial: string | null;
    parameterId: string;
  },
>(
  userParams: T[],
): Promise<
  Array<
    Omit<T, "locationId" | "parameterId"> & {
      location: {
        id: string;
        address: string;
        campus: string;
      } | null;
      book: T["book"] & { editorial: string };
      parameter: {
        id: string;
        name: string;
        type: string;
        amount: string;
      } | null;
    }
  >
> {
  // Fetch all parameters from backoffice
  const parameters = await getAllParametersFromBackoffice();
  const parameterMap = new Map<
    string,
    {
      id: string;
      name: string;
      type: string;
      amount: string;
    }
  >(
    parameters.map((p) => [
      p.id_parametro,
      {
        id: p.id_parametro,
        name: p.nombre,
        type: p.tipo,
        amount: p.valor_numerico,
      },
    ]),
  );

  // Fetch locations
  const uniqueLocationIds = [
    ...new Set(userParams.map((param) => param.locationId).filter(Boolean)),
  ] as string[];

  const locationMap = new Map<
    string,
    { id: string; address: string; campus: string }
  >();

  await Promise.all(
    uniqueLocationIds.map(async (locationId) => {
      try {
        const location = await getLocationFromBackoffice(locationId);
        if (location) {
          locationMap.set(locationId, {
            id: location.id_sede,
            address: location.ubicacion,
            campus: location.nombre,
          });
        }
      } catch (error) {
        console.error(
          `Failed to fetch location ${locationId} from backoffice:`,
          error,
        );
      }
    }),
  );

  return userParams.map((param) => {
    const { locationId, parameterId, ...paramWithoutExtra } = param;
    return {
      ...paramWithoutExtra,
      book: {
        ...param.book,
        editorial: param.editorial ?? "",
      },
      location: locationId ? (locationMap.get(locationId) ?? null) : null,
      parameter: parameterMap.get(parameterId) ?? null,
    };
  });
}

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
        status: z.enum(["PENDING", "PAID"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(userParameters.userId, userId)];

      if (input.status) {
        conditions.push(eq(userParameters.status, input.status));
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
          id: userParameters.id,
          userId: userParameters.userId,
          loanId: userParameters.loanId,
          parameterId: userParameters.parameterId,
          status: userParameters.status,
          createdAt: userParameters.createdAt,
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(userParameters.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: userParameters.id })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .where(whereConditions);

      // Enrich with location and parameter data from backoffice
      const enrichedResults = await enrichUserParametersWithData(results);

      return {
        results: enrichedResults,
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
        status: z.enum(["PENDING", "PAID"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const whereConditions = input.status
        ? and(
            eq(userParameters.userId, userId),
            eq(userParameters.status, input.status),
          )
        : eq(userParameters.userId, userId);

      const results = await ctx.db
        .select({
          id: userParameters.id,
          userId: userParameters.userId,
          loanId: userParameters.loanId,
          parameterId: userParameters.parameterId,
          status: userParameters.status,
          createdAt: userParameters.createdAt,
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(userParameters.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: userParameters.id })
        .from(userParameters)
        .where(whereConditions);

      // Enrich with location and parameter data from backoffice
      const enrichedResults = await enrichUserParametersWithData(results);

      return {
        results: enrichedResults,
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
          id: userParameters.id,
          userId: userParameters.userId,
          loanId: userParameters.loanId,
          parameterId: userParameters.parameterId,
          status: userParameters.status,
          createdAt: userParameters.createdAt,
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(eq(userParameters.id, input.id))
        .limit(1);

      if (result.length === 0) return null;

      // Enrich with location and parameter data from backoffice
      const enrichedResult = await enrichUserParametersWithData([result[0]!]);

      return enrichedResult[0] ?? null;
    }),

  markAsPaid: protectedProcedure
    .input(z.object({ penaltyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existingPenalty = await ctx.db
        .select()
        .from(userParameters)
        .where(
          and(
            eq(userParameters.id, input.penaltyId),
            eq(userParameters.userId, userId),
          ),
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
        .update(userParameters)
        .set({ status: "PAID" })
        .where(eq(userParameters.id, input.penaltyId));

      return { success: true };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const allPenalties = await ctx.db
      .select({
        id: userParameters.id,
        userId: userParameters.userId,
        loanId: userParameters.loanId,
        parameterId: userParameters.parameterId,
        status: userParameters.status,
        createdAt: userParameters.createdAt,
      })
      .from(userParameters)
      .where(eq(userParameters.userId, userId));

    const pendingPenalties = allPenalties.filter(
      (penalty) => penalty.status === "PENDING",
    ).length;

    const paidPenalties = allPenalties.filter(
      (penalty) => penalty.status === "PAID",
    ).length;

    // Get parameter amounts from backoffice
    const parameters = await getAllParametersFromBackoffice();
    const parameterMap = new Map<string, number>(
      parameters.map((p) => [p.id_parametro, parseFloat(p.valor_numerico)]),
    );

    const totalAmount = allPenalties.reduce((sum, penalty) => {
      if (penalty.status === "PAID") return sum;
      const amount = parameterMap.get(penalty.parameterId) ?? 0;
      return sum + amount;
    }, 0);

    return {
      pendingPenalties,
      paidPenalties,
      totalAmount,
    };
  }),

  getByUserIdAdmin: enforceUserIsAdmin
    .input(
      z.object({
        userId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z.enum(["PENDING", "PAID"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(userParameters.userId, input.userId)];

      if (input.status) {
        conditions.push(eq(userParameters.status, input.status));
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
          id: userParameters.id,
          userId: userParameters.userId,
          loanId: userParameters.loanId,
          parameterId: userParameters.parameterId,
          status: userParameters.status,
          createdAt: userParameters.createdAt,
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(userParameters.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: userParameters.id })
        .from(userParameters)
        .innerJoin(loans, eq(userParameters.loanId, loans.id))
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .where(whereConditions);

      // Enrich with location and parameter data from backoffice
      const enrichedResults = await enrichUserParametersWithData(results);

      return {
        results: enrichedResults,
        total: totalResults.length,
        page: input.page,
        limit: input.limit,
      };
    }),
});
