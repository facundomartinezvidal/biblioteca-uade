import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roles, users } from "~/server/db/schemas";
import { eq } from "drizzle-orm";
import type { RouterOutput } from "../root";

export type getUserOutput = RouterOutput["user"]["getUser"];

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select({
        id: users.id,
        nombre: users.nombre,
        apellido: users.apellido,
        correo_institucional: users.correo_institucional,
        dni: users.dni,
        legajo: users.legajo,
        rol: roles.nombre_rol,
        telefono_personal: users.telefono_personal,
      })
      .from(users)
      .where(eq(users.id, ctx.user?.id ?? ""))
      .innerJoin(roles, eq(users.id_rol, roles.id_rol));

    return {
      name: user[0]?.nombre ?? "",
      last_name: user[0]?.apellido,
      email: user[0]?.correo_institucional,
      phone: user[0]?.telefono_personal,
      identity_card: user[0]?.dni,
      legacy_number: user[0]?.legajo,
      role: user[0]?.rol,
    };
  }),
});
