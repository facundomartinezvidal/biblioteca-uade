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
import { penalties } from "~/server/db/schemas/penalties";
import { sanctions } from "~/server/db/schemas/sanctions";
import { notifications } from "~/server/db/schemas/notifications";
import { eq, and, desc, or, ilike } from "drizzle-orm";
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

  createReservationForStudent: enforceUserIsAdmin
    .input(z.object({ bookId: z.string(), studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verificar que el usuario sea un estudiante
      const student = await ctx.db
        .select({
          id: users.id,
          rol: roles.nombre_rol,
        })
        .from(users)
        .where(eq(users.id, input.studentId))
        .innerJoin(roles, eq(users.id_rol, roles.id_rol))
        .limit(1);

      if (!student[0] || student[0].rol !== "estudiante") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El usuario seleccionado no es un estudiante",
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

  activateLoan: enforceUserIsAdmin
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

      if (loan[0].status !== "RESERVED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Solo se pueden activar préstamos en estado RESERVADO",
        });
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7); // 7 días para préstamos activos (igual que reservas)

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

      return { success: true };
    }),

  finishLoan: enforceUserIsAdmin
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

      if (loan[0].status !== "ACTIVE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Solo se pueden finalizar préstamos en estado ACTIVO",
        });
      }

      await ctx.db
        .update(loans)
        .set({ status: "FINISHED" })
        .where(eq(loans.id, input.loanId));

      await ctx.db
        .update(books)
        .set({ status: "AVAILABLE" })
        .where(eq(books.id, loan[0].bookId));

      return { success: true };
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

      if (loan[0].status !== "ACTIVE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Solo se pueden multar préstamos en estado ACTIVO",
        });
      }

      // Buscar la sanción por libro dañado
      const damagedBookSanction = await ctx.db
        .select()
        .from(sanctions)
        .where(eq(sanctions.type, "LIBRO_DANADO"))
        .limit(1);

      if (!damagedBookSanction[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No se encontró la sanción por libro dañado",
        });
      }

      const now = new Date();

      // Crear la multa por libro dañado
      const newPenalty = await ctx.db
        .insert(penalties)
        .values({
          userId: loan[0].userId,
          loanId: input.loanId,
          sanctionId: damagedBookSanction[0].id,
          status: "PENDING",
          createdAt: now,
        })
        .returning();

      // Crear notificación para el usuario
      if (newPenalty[0]) {
        await ctx.db.insert(notifications).values({
          userId: loan[0].userId,
          type: "PENALTY_APPLIED",
          title: "Nueva multa aplicada",
          message: `Se te ha aplicado una multa de $${damagedBookSanction[0].amount} por libro dañado.`,
          penaltyId: newPenalty[0].id,
          loanId: input.loanId,
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

      return { success: true };
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

    // Obtener multas pendientes (no pagadas)
    const allPenalties = await ctx.db
      .select()
      .from(penalties)
      .where(eq(penalties.userId, userId));

    const pendingFines = allPenalties.filter(
      (penalty) => penalty.status === "PENDING" || penalty.status === "EXPIRED",
    ).length;

    return {
      activeLoans,
      finishedLoans,
      pendingFines,
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
