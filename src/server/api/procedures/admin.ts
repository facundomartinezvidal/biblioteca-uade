import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { roles, users } from "~/server/db/schemas";

import { protectedProcedure } from "../trpc";

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Debes iniciar sesión para acceder a este recurso",
    });
  }

  const userWithRole = await ctx.db
    .select({
      rol: roles.nombre_rol,
    })
    .from(users)
    .where(eq(users.id, ctx.user.id))
    .innerJoin(roles, eq(users.id_rol, roles.id_rol))
    .limit(1);

  const role = userWithRole[0]?.rol?.toLowerCase();

  if (role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No tienes permisos para acceder a este recurso",
    });
  }

  return next({
    ctx,
  });
});


