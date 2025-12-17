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
import { editorials } from "~/server/db/schemas/editorials";
import { userParameters } from "~/server/db/schemas/user-parameters";
import { notifications } from "~/server/db/schemas/notifications";
import { eq, and, desc, or, ilike, count, gte, lte, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publishEvent, RABBITMQ_ROUTING_KEYS } from "~/lib/rabbitmq";
import {
  getLocationFromBackoffice,
  getParameterByNameFromBackoffice,
} from "~/lib/backoffice-api";

// Límite máximo de libros que un usuario puede tener reservados/prestados a la vez
const MAX_ACTIVE_LOANS_PER_USER = 5;

/**
 * Helper function to enrich loans with location data from backoffice
 */
async function enrichLoansWithLocations<
  T extends {
    locationId: string | null;
    book: Record<string, unknown>;
    editorial: string | null;
  },
>(
  loans: T[],
): Promise<
  Array<
    Omit<T, "locationId"> & {
      location: {
        id: string;
        address: string;
        campus: string;
      } | null;
      book: T["book"] & { editorial: string };
    }
  >
> {
  const uniqueLocationIds = [
    ...new Set(loans.map((loan) => loan.locationId).filter(Boolean)),
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

  return loans.map((loan) => {
    const { locationId, ...loanWithoutLocationId } = loan;
    return {
      ...loanWithoutLocationId,
      book: {
        ...loan.book,
        editorial: loan.editorial ?? "",
      },
      location: locationId ? (locationMap.get(locationId) ?? null) : null,
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

export const loansRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        status: z
          .enum(["RESERVED", "ACTIVE", "FINISHED", "EXPIRED", "CANCELLED"])
          .optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(loans.userId, userId)];

      if (input.status) {
        conditions.push(eq(loans.status, input.status));
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(loans.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: loans.id })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .where(whereConditions);

      // Enrich loans with location data from backoffice
      const enrichedResults = await enrichLoansWithLocations(results);

      return {
        results: enrichedResults,
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
        locationId: books.locationId,
        editorial: editorials.name,
      })
      .from(loans)
      .innerJoin(books, eq(loans.bookId, books.id))
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(genders, eq(books.genderId, genders.id))
      .leftJoin(editorials, eq(books.editorialId, editorials.id))
      .where(and(eq(loans.userId, userId), eq(loans.status, "ACTIVE")))
      .orderBy(desc(loans.createdAt));

    // Enrich loans with location data from backoffice
    const enrichedResults = await enrichLoansWithLocations(results);

    return {
      results: enrichedResults,
      total: enrichedResults.length,
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(eq(loans.id, input.id))
        .limit(1);

      if (result.length === 0) return null;

      // Enrich the single loan with location data from backoffice
      const enrichedResult = await enrichLoansWithLocations([result[0]!]);

      return enrichedResult[0] ?? null;
    }),

  // Verifica si el usuario será multado al cancelar una reserva
  checkCancellationPenalty: protectedProcedure
    .input(z.object({ loanId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const existingLoan = await ctx.db
        .select()
        .from(loans)
        .where(and(eq(loans.id, input.loanId), eq(loans.userId, userId)))
        .limit(1);

      if (existingLoan.length === 0 || existingLoan[0]!.status !== "RESERVED") {
        return { willBePenalized: false, cancellationCount: 0 };
      }

      const bookId = existingLoan[0]!.bookId;

      // Find the last successful loan to get cutoff date
      const lastSuccessfulLoan = await ctx.db
        .select({ createdAt: loans.createdAt })
        .from(loans)
        .where(
          and(
            eq(loans.userId, userId),
            eq(loans.bookId, bookId),
            or(eq(loans.status, "ACTIVE"), eq(loans.status, "FINISHED")),
          ),
        )
        .orderBy(desc(loans.createdAt))
        .limit(1);

      const cutoffDate =
        lastSuccessfulLoan[0]?.createdAt ?? new Date(0).toISOString();

      // Count previous cancellations since last successful loan
      const previousCancellations = await ctx.db
        .select({ count: count() })
        .from(loans)
        .where(
          and(
            eq(loans.userId, userId),
            eq(loans.bookId, bookId),
            eq(loans.status, "CANCELLED"),
            gt(loans.createdAt, cutoffDate),
          ),
        );

      const cancellationCount = previousCancellations[0]?.count ?? 0;

      // Will be penalized if this would be the 2nd cancellation (count + 1 >= 2)
      return {
        willBePenalized: cancellationCount + 1 >= 2,
        cancellationCount: cancellationCount,
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

      // Find the last time this user actually borrowed this book successfully (ACTIVE or FINISHED)
      // We only count cancellations that occurred AFTER this date to allowing "resetting" the strike count.
      const lastSuccessfulLoan = await ctx.db
        .select({ createdAt: loans.createdAt })
        .from(loans)
        .where(
          and(
            eq(loans.userId, userId),
            eq(loans.bookId, bookId),
            or(eq(loans.status, "ACTIVE"), eq(loans.status, "FINISHED")),
          ),
        )
        .orderBy(desc(loans.createdAt))
        .limit(1);

      const cutoffDate =
        lastSuccessfulLoan[0]?.createdAt ?? new Date(0).toISOString();

      // Check for previous cancellations of the same book by this user SINCE the last successful loan
      const recentCancellations = await ctx.db
        .select({ count: count() })
        .from(loans)
        .where(
          and(
            eq(loans.userId, userId),
            eq(loans.bookId, bookId),
            eq(loans.status, "CANCELLED"),
            gt(loans.createdAt, cutoffDate),
          ),
        );

      const cancellationCount = recentCancellations[0]?.count ?? 0;

      if (cancellationCount >= 2) {
        // Apply penalty "Cancelacion Reserva"
        const PENALTY_PARAM_ID = "a87b8068-f472-4a39-acca-d64ea06fe6c5";
        const PENALTY_AMOUNT = "100.00"; // Should probably fetch but user gave us the JSON

        const newPenalty = await ctx.db
          .insert(userParameters)
          .values({
            userId: userId,
            loanId: input.loanId,
            parameterId: PENALTY_PARAM_ID,
            status: "PENDING",
            createdAt: new Date(),
          })
          .returning();

        if (newPenalty[0]) {
          // Notify user
          await ctx.db.insert(notifications).values({
            userId: userId,
            type: "PENALTY_APPLIED",
            title: "Sanción por cancelación reiterada",
            message: `Has cancelado la reserva de este libro 2 veces. Se ha aplicado una sanción de $${PENALTY_AMOUNT}.`,
            penaltyId: newPenalty[0].id,
            loanId: input.loanId,
            read: false,
          });

          // Publish event
          await publishEvent(RABBITMQ_ROUTING_KEYS.PENALTY_CREATED, {
            sanctionId: newPenalty[0].id,
            userId: newPenalty[0].userId,
            parameterId: newPenalty[0].parameterId,
            amount: PENALTY_AMOUNT,
            status: newPenalty[0].status,
            createdAt: newPenalty[0].createdAt,
          });
        }
      }

      return { success: true };
    }),

  createReservation: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verificar límite de préstamos/reservas activas
      const activeLoansCount = await ctx.db
        .select({ count: count() })
        .from(loans)
        .where(
          and(
            eq(loans.userId, userId),
            or(eq(loans.status, "RESERVED"), eq(loans.status, "ACTIVE")),
          ),
        );

      if ((activeLoansCount[0]?.count ?? 0) >= MAX_ACTIVE_LOANS_PER_USER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Ya tenés ${MAX_ACTIVE_LOANS_PER_USER} libros reservados o en préstamo. Devolvé alguno antes de reservar otro.`,
        });
      }

      const book = await ctx.db
        .select()
        .from(books)
        .where(eq(books.id, input.bookId))
        .limit(1);

      if (book.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Libro no encontrado",
        });
      }

      if (book[0]!.status !== "AVAILABLE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El libro no está disponible para reserva",
        });
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

  createReservationForStudent: enforceUserIsAdmin
    .input(z.object({ bookId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Note: We're trusting that the studentId is valid since it comes from backoffice
      // The backoffice handles user validation

      // Verificar límite de préstamos/reservas activas del estudiante
      const activeLoansCount = await ctx.db
        .select({ count: count() })
        .from(loans)
        .where(
          and(
            eq(loans.userId, input.studentId),
            or(eq(loans.status, "RESERVED"), eq(loans.status, "ACTIVE")),
          ),
        );

      if ((activeLoansCount[0]?.count ?? 0) >= MAX_ACTIVE_LOANS_PER_USER) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Este usuario ya tiene ${MAX_ACTIVE_LOANS_PER_USER} libros reservados o en préstamo. Debe devolver alguno antes de prestarle otro.`,
        });
      }

      const book = await ctx.db
        .select()
        .from(books)
        .where(eq(books.id, input.bookId))
        .limit(1);

      if (book.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Libro no encontrado",
        });
      }

      if (book[0]!.status !== "AVAILABLE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El libro no está disponible para préstamo",
        });
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7); // 7 días para préstamos activos (igual que reservas)

      const newLoan = await ctx.db
        .insert(loans)
        .values({
          bookId: input.bookId,
          userId: input.studentId,
          status: "ACTIVE", // Directamente ACTIVO porque el admin entrega el libro
          createdAt: now.toISOString(),
          endDate: endDate.toISOString(),
        })
        .returning();

      await ctx.db
        .update(books)
        .set({ status: "NOT_AVAILABLE" }) // NOT_AVAILABLE porque está prestado
        .where(eq(books.id, input.bookId));

      return { success: true, loan: newLoan[0] };
    }),

  // Check if a reservation is past the 24-hour pickup window
  checkLatePickup: enforceUserIsAdmin
    .input(z.object({ loanId: z.string() }))
    .query(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId))
        .limit(1);

      if (!loan[0] || loan[0].status !== "RESERVED") {
        return { isLatePickup: false, hoursLate: 0 };
      }

      const createdAt = new Date(loan[0].createdAt);
      const now = new Date();
      const hoursSinceCreation =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      const isLatePickup = hoursSinceCreation > 24;
      const hoursLate = isLatePickup ? Math.floor(hoursSinceCreation - 24) : 0;

      return { isLatePickup, hoursLate };
    }),

  // Check if a loan is past its end date (late return)
  checkLateReturn: enforceUserIsAdmin
    .input(z.object({ loanId: z.string() }))
    .query(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId))
        .limit(1);

      if (
        !loan[0] ||
        (loan[0].status !== "ACTIVE" && loan[0].status !== "EXPIRED")
      ) {
        return { isLateReturn: false, daysLate: 0 };
      }

      if (!loan[0].endDate) {
        return { isLateReturn: false, daysLate: 0 };
      }

      const endDate = new Date(loan[0].endDate);
      const now = new Date();
      const msLate = now.getTime() - endDate.getTime();

      const isLateReturn = msLate > 0;
      const daysLate = isLateReturn
        ? Math.floor(msLate / (1000 * 60 * 60 * 24))
        : 0;

      return { isLateReturn, daysLate };
    }),

  activateLoan: enforceUserIsAdmin
    .input(
      z.object({
        loanId: z.string(),
        applyLatePickupPenalty: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId))
        .limit(1);

      if (!loan[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      if (loan[0].status !== "RESERVED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Solo se pueden activar préstamos en estado RESERVADO",
        });
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7); // 7 días para préstamos activos (igual que reservas)

      // Check if late pickup penalty should be applied
      let penaltyApplied = false;
      if (input.applyLatePickupPenalty) {
        const createdAt = new Date(loan[0].createdAt);
        const hoursSinceCreation =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreation > 24) {
          // Get the "Retiro atrasado" parameter from backoffice
          const latePickupParam =
            await getParameterByNameFromBackoffice("Retiro atrasado");

          if (latePickupParam) {
            // Create penalty for late pickup
            const newPenalty = await ctx.db
              .insert(userParameters)
              .values({
                userId: loan[0].userId,
                loanId: input.loanId,
                parameterId: latePickupParam.id_parametro,
                status: "PENDING",
                createdAt: now,
              })
              .returning();

            // Create notification for the penalty
            await ctx.db.insert(notifications).values({
              userId: loan[0].userId,
              type: "PENALTY_APPLIED",
              title: "Multa por retiro tardío",
              message: `Se te aplicó una multa por no retirar el libro dentro de las 24 horas.`,
              loanId: input.loanId,
              read: false,
              createdAt: now,
            });

            // Publish event to RabbitMQ
            if (newPenalty[0]) {
              void publishEvent(RABBITMQ_ROUTING_KEYS.PENALTY_CREATED, {
                sanctionId: newPenalty[0].id,
                userId: newPenalty[0].userId,
                parameterId: newPenalty[0].parameterId,
                amount: parseFloat(latePickupParam.valor_numerico),
                status: newPenalty[0].status,
                createdAt: newPenalty[0].createdAt,
              });
            }

            penaltyApplied = true;
          }
        }
      }

      await ctx.db
        .update(loans)
        .set({
          status: "ACTIVE",
          endDate: endDate.toISOString(),
        })
        .where(eq(loans.id, input.loanId));

      await ctx.db
        .update(books)
        .set({ status: "NOT_AVAILABLE" })
        .where(eq(books.id, loan[0].bookId));

      return { success: true, penaltyApplied };
    }),

  finishLoan: enforceUserIsAdmin
    .input(
      z.object({
        loanId: z.string(),
        applyLateReturnPenalty: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId))
        .limit(1);

      if (!loan[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      if (loan[0].status !== "ACTIVE" && loan[0].status !== "EXPIRED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Solo se pueden finalizar préstamos en estado ACTIVO o EXPIRADO",
        });
      }

      const now = new Date();
      let penaltyApplied = false;

      // Check if late return penalty should be applied
      if (input.applyLateReturnPenalty && loan[0].endDate) {
        const endDate = new Date(loan[0].endDate);

        if (now.getTime() > endDate.getTime()) {
          // Get the "Devolución tardía" parameter from backoffice
          const lateReturnParam =
            await getParameterByNameFromBackoffice("Devolución tardía");

          if (lateReturnParam) {
            // Create penalty for late return
            const newPenalty = await ctx.db
              .insert(userParameters)
              .values({
                userId: loan[0].userId,
                loanId: input.loanId,
                parameterId: lateReturnParam.id_parametro,
                status: "PENDING",
                createdAt: now,
              })
              .returning();

            // Create notification for the penalty
            await ctx.db.insert(notifications).values({
              userId: loan[0].userId,
              type: "PENALTY_APPLIED",
              title: "Multa por devolución tardía",
              message: `Se te aplicó una multa por devolver el libro después de la fecha límite.`,
              loanId: input.loanId,
              read: false,
              createdAt: now,
            });

            // Publish event to RabbitMQ
            if (newPenalty[0]) {
              void publishEvent(RABBITMQ_ROUTING_KEYS.PENALTY_CREATED, {
                sanctionId: newPenalty[0].id,
                userId: newPenalty[0].userId,
                parameterId: newPenalty[0].parameterId,
                amount: parseFloat(lateReturnParam.valor_numerico),
                status: newPenalty[0].status,
                createdAt: newPenalty[0].createdAt,
              });
            }

            penaltyApplied = true;
          }
        }
      }

      await ctx.db
        .update(loans)
        .set({ status: "FINISHED" })
        .where(eq(loans.id, input.loanId));

      await ctx.db
        .update(books)
        .set({ status: "AVAILABLE" })
        .where(eq(books.id, loan[0].bookId));

      return { success: true, penaltyApplied };
    }),

  createPenaltyForDamagedBook: enforceUserIsAdmin
    .input(z.object({ loanId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId))
        .limit(1);

      if (!loan[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      if (loan[0].status !== "ACTIVE" && loan[0].status !== "EXPIRED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Solo se pueden multar préstamos en estado ACTIVO o EXPIRADO",
        });
      }

      // Buscar el parámetro de libro dañado desde backoffice
      const damagedBookParameter =
        await getParameterByNameFromBackoffice("Libro roto");

      if (!damagedBookParameter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró el parámetro por libro dañado",
        });
      }

      const now = new Date();
      let lateReturnPenaltyApplied = false;

      // Check if also late return and apply that penalty first
      if (loan[0].endDate) {
        const endDate = new Date(loan[0].endDate);
        if (now.getTime() > endDate.getTime()) {
          const lateReturnParam =
            await getParameterByNameFromBackoffice("Devolución tardía");

          if (lateReturnParam) {
            // Create penalty for late return
            const lateReturnPenalty = await ctx.db
              .insert(userParameters)
              .values({
                userId: loan[0].userId,
                loanId: input.loanId,
                parameterId: lateReturnParam.id_parametro,
                status: "PENDING",
                createdAt: now,
              })
              .returning();

            if (lateReturnPenalty[0]) {
              // Create notification for late return penalty
              await ctx.db.insert(notifications).values({
                userId: loan[0].userId,
                type: "PENALTY_APPLIED",
                title: "Multa por devolución tardía",
                message: `Se te aplicó una multa de $${lateReturnParam.valor_numerico} por devolver el libro después de la fecha límite.`,
                penaltyId: lateReturnPenalty[0].id,
                loanId: input.loanId,
              });

              // Publish event to RabbitMQ for late return
              await publishEvent(RABBITMQ_ROUTING_KEYS.PENALTY_CREATED, {
                sanctionId: lateReturnPenalty[0].id,
                userId: lateReturnPenalty[0].userId,
                parameterId: lateReturnPenalty[0].parameterId,
                amount: parseFloat(lateReturnParam.valor_numerico),
                status: lateReturnPenalty[0].status,
                createdAt: lateReturnPenalty[0].createdAt,
              });

              lateReturnPenaltyApplied = true;
            }
          }
        }
      }

      // Crear la multa por libro dañado
      const newPenalty = await ctx.db
        .insert(userParameters)
        .values({
          userId: loan[0].userId,
          loanId: input.loanId,
          parameterId: damagedBookParameter.id_parametro,
          status: "PENDING",
          createdAt: now,
        })
        .returning();

      // Crear notificación para el usuario
      if (newPenalty[0]) {
        await ctx.db.insert(notifications).values({
          userId: loan[0].userId,
          type: "PENALTY_APPLIED",
          title: "Multa por libro dañado",
          message: `Se te ha aplicado una multa de $${damagedBookParameter.valor_numerico} por libro dañado.`,
          penaltyId: newPenalty[0].id,
          loanId: input.loanId,
        });

        // Publicar evento en RabbitMQ for damaged book
        await publishEvent(RABBITMQ_ROUTING_KEYS.PENALTY_CREATED, {
          sanctionId: newPenalty[0].id,
          userId: newPenalty[0].userId,
          parameterId: newPenalty[0].parameterId,
          amount: parseFloat(damagedBookParameter.valor_numerico),
          status: newPenalty[0].status,
          createdAt: newPenalty[0].createdAt,
        });
      }

      // Marcar el préstamo como finalizado
      await ctx.db
        .update(loans)
        .set({ status: "FINISHED" })
        .where(eq(loans.id, input.loanId));

      // Marcar el libro como disponible (el admin puede decidir si prestarlo nuevamente)
      await ctx.db
        .update(books)
        .set({ status: "AVAILABLE" })
        .where(eq(books.id, loan[0].bookId));

      return { success: true, lateReturnPenaltyApplied };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Optimized: Use aggregations instead of fetching all records
    const [loanStats, penaltyStats] = await Promise.all([
      ctx.db
        .select({
          status: loans.status,
          count: count(),
        })
        .from(loans)
        .where(eq(loans.userId, userId))
        .groupBy(loans.status),
      ctx.db
        .select({
          status: userParameters.status,
          count: count(),
        })
        .from(userParameters)
        .where(eq(userParameters.userId, userId))
        .groupBy(userParameters.status),
    ]);

    const loanStatusMap = loanStats.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.status] = Number(item.count ?? 0);
        return acc;
      },
      {},
    );

    const penaltyStatusMap = penaltyStats.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.status] = Number(item.count ?? 0);
        return acc;
      },
      {},
    );

    const activeLoans = loanStatusMap.ACTIVE ?? 0;
    const finishedLoans = loanStatusMap.FINISHED ?? 0;
    const pendingFines =
      (penaltyStatusMap.PENDING ?? 0) + (penaltyStatusMap.EXPIRED ?? 0);

    // Optimized: Only fetch active/reserved loans for upcoming due calculation
    const now = new Date();
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(now.getDate() + 2);

    const upcomingDueLoans = await ctx.db
      .select({ id: loans.id })
      .from(loans)
      .where(
        and(
          eq(loans.userId, userId),
          or(eq(loans.status, "ACTIVE"), eq(loans.status, "RESERVED")),
          gte(loans.endDate, now.toISOString()),
          lte(loans.endDate, twoDaysFromNow.toISOString()),
        ),
      );

    return {
      activeLoans,
      finishedLoans,
      pendingFines,
      upcomingDue: upcomingDueLoans.length,
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
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(loans.userId, input.userId)];

      if (input.status) {
        conditions.push(eq(loans.status, input.status));
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
          locationId: books.locationId,
          editorial: editorials.name,
        })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .leftJoin(genders, eq(books.genderId, genders.id))
        .leftJoin(editorials, eq(books.editorialId, editorials.id))
        .where(whereConditions)
        .orderBy(desc(loans.createdAt))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ count: loans.id })
        .from(loans)
        .innerJoin(books, eq(loans.bookId, books.id))
        .leftJoin(authors, eq(books.authorId, authors.id))
        .where(whereConditions);

      // Enrich loans with location data from backoffice
      const enrichedResults = await enrichLoansWithLocations(results);

      return {
        results: enrichedResults,
        total: totalResults.length,
        page: input.page,
        limit: input.limit,
      };
    }),
});
