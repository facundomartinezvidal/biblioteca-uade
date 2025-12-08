import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc";

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Debes iniciar sesión para acceder a este recurso",
    });
  }

  // Check role from context (comes from Core API)
  const userRole = ctx.user.role?.toUpperCase();
  const userSubrol = ctx.user.subrol?.toUpperCase();

  // Only ADMINISTRADOR with BIBLIOTECARIO subrol can access admin procedures
  if (userRole !== "ADMINISTRADOR" || userSubrol !== "BIBLIOTECARIO") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No tienes permisos para acceder a este recurso",
    });
  }

  return next({
    ctx,
  });
});
