import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roles, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userData = await ctx.db
      .select({
        id: users.id,
        name: users.nombre,
        last_name: users.apellido,
        email: users.correo_institucional,
        phone: users.telefono_personal,
        identity_card: users.dni,
        career: users.legajo,
        rol: roles.nombre_rol,
        description: roles.descripcion,
        subcategory: roles.subcategoria,
        base_salary: roles.sueldo_base,
        status: roles.status,
      })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .innerJoin(roles, eq(users.id_rol, roles.id_rol));

    if (!userData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario no encontrado",
      });
    }

    return {
      user: userData[0],
    };
  }),
});
