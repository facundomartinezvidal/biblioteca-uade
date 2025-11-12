import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roles, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    // First, get user data quickly
    const userResult = await ctx.db
      .select({
        id: users.id,
        name: users.nombre,
        last_name: users.apellido,
        email: users.correo_institucional,
        phone: users.telefono_personal,
        identity_card: users.dni,
        career: users.legajo,
        id_rol: users.id_rol,
      })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!userResult || userResult.length === 0) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario no encontrado",
      });
    }

    const user = userResult[0]!;

    // Then get role data if exists
    let roleData = null;
    if (user.id_rol) {
      const roleResult = await ctx.db
        .select({
          nombre_rol: roles.nombre_rol,
          descripcion: roles.descripcion,
          subcategoria: roles.subcategoria,
          sueldo_base: roles.sueldo_base,
          status: roles.status,
        })
        .from(roles)
        .where(eq(roles.id_rol, user.id_rol))
        .limit(1);

      roleData = roleResult[0] ?? null;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        identity_card: user.identity_card,
        career: user.career,
        rol: roleData?.nombre_rol ?? null,
        description: roleData?.descripcion ?? null,
        subcategory: roleData?.subcategoria ?? null,
        base_salary: roleData?.sueldo_base ?? null,
        status: roleData?.status ?? null,
      },
    };
  }),
});
