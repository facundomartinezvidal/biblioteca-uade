import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { notifications } from "~/server/db/schemas/notifications";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = createTRPCRouter({
  // Obtener todas las notificaciones del usuario actual
  getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const userNotifications = await ctx.db
      .select({
        id: notifications.id,
        type: notifications.type,
        title: notifications.title,
        message: notifications.message,
        read: notifications.read,
        loanId: notifications.loanId,
        penaltyId: notifications.penaltyId,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return userNotifications;
  }),

  // Obtener el conteo de notificaciones no leídas
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const unreadNotifications = await ctx.db
      .select({
        id: notifications.id,
      })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false)),
      );

    return { count: unreadNotifications.length };
  }),

  // Marcar una notificación como leída
  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const notification = await ctx.db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.notificationId))
        .limit(1);

      if (!notification[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notificación no encontrada",
        });
      }

      if (notification[0].userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para modificar esta notificación",
        });
      }

      await ctx.db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, input.notificationId));

      return { success: true };
    }),

  // Marcar todas las notificaciones como leídas
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    await ctx.db
      .update(notifications)
      .set({ read: true })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false)),
      );

    return { success: true };
  }),

  // Crear una notificación (solo para uso interno del sistema)
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        type: z.enum([
          "LOAN_DEADLINE",
          "LOAN_EXPIRED",
          "PENALTY_APPLIED",
          "PENALTY_DEADLINE",
          "PENALTY_EXPIRED",
        ]),
        title: z.string(),
        message: z.string(),
        loanId: z.string().uuid().optional(),
        penaltyId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newNotification = await ctx.db
        .insert(notifications)
        .values({
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          loanId: input.loanId,
          penaltyId: input.penaltyId,
        })
        .returning();

      return newNotification[0];
    }),

  // Eliminar notificaciones antiguas (más de 30 días)
  cleanOldNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    // Solo permitir a admins
    const userRole = ctx.user.role?.toUpperCase();
    const userSubrol = ctx.user.subrol?.toUpperCase();

    if (userRole !== "ADMINISTRADOR" || userSubrol !== "BIBLIOTECARIO") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No tienes permisos para realizar esta acción",
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await ctx.db.delete(notifications).where(
      and(
        eq(notifications.read, true),
        // notifications.createdAt < thirtyDaysAgo
      ),
    );

    return { success: true };
  }),
});
