import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sanctions } from "~/server/db/schemas/sanctions";
import { eq } from "drizzle-orm";

export const sanctionsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allSanctions = await ctx.db
      .select({
        id: sanctions.id,
        name: sanctions.name,
        type: sanctions.type,
        description: sanctions.description,
        amount: sanctions.amount,
        createdAt: sanctions.createdAt,
        updatedAt: sanctions.updatedAt,
      })
      .from(sanctions);

    return allSanctions;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const sanction = await ctx.db
        .select({
          id: sanctions.id,
          name: sanctions.name,
          type: sanctions.type,
          description: sanctions.description,
          amount: sanctions.amount,
          createdAt: sanctions.createdAt,
          updatedAt: sanctions.updatedAt,
        })
        .from(sanctions)
        .where(eq(sanctions.id, input.id))
        .limit(1);

      return sanction[0] ?? null;
    }),

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "LIBRO_DANADO",
          "RETIRO_ATRASADO",
          "DEVOLUCION_TARDIA",
          "RESERVA_CANCELADA",
          "PAGO_ATRASADO",
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sanction = await ctx.db
        .select({
          id: sanctions.id,
          name: sanctions.name,
          type: sanctions.type,
          description: sanctions.description,
          amount: sanctions.amount,
          createdAt: sanctions.createdAt,
          updatedAt: sanctions.updatedAt,
        })
        .from(sanctions)
        .where(eq(sanctions.type, input.type))
        .limit(1);

      return sanction[0] ?? null;
    }),
});
