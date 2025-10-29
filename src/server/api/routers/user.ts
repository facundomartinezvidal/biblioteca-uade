import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roles, users } from "~/server/db/schemas";
import { eq, like, or, desc, and } from "drizzle-orm";
import type { RouterOutput } from "../root";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export type getUserOutput = RouterOutput["user"]["getUser"];

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

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select({
        id: users.id,
        nombre: users.nombre,
        apellido: users.apellido,
        correo_institucional: users.correo_institucional,
        correo_personal: users.correo_personal,
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
      institutional_email: user[0]?.correo_institucional,
      personal_email: user[0]?.correo_personal,
      phone: user[0]?.telefono_personal,
      identity_card: user[0]?.dni,
      legacy_number: user[0]?.legajo,
      role: user[0]?.rol,
    };
  }),

  getAllStudents: enforceUserIsAdmin
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      // Obtener el id_rol de estudiante
      const studentRole = await ctx.db
        .select({ id_rol: roles.id_rol })
        .from(roles)
        .where(eq(roles.nombre_rol, "estudiante"))
        .limit(1);

      if (!studentRole[0]) {
        return { results: [], total: 0, page: input.page, limit: input.limit };
      }

      const studentRoleId = studentRole[0].id_rol;

      let whereConditions = [eq(users.id_rol, studentRoleId)];

      if (input.search && input.search.trim()) {
        const searchTerm = `%${input.search.trim()}%`;
        whereConditions.push(
          or(
            like(users.nombre, searchTerm),
            like(users.apellido, searchTerm),
            like(users.legajo, searchTerm),
            like(users.correo_institucional, searchTerm),
            like(users.dni, searchTerm),
          )!,
        );
      }

      const results = await ctx.db
        .select({
          id: users.id,
          nombre: users.nombre,
          apellido: users.apellido,
          correo_institucional: users.correo_institucional,
          correo_personal: users.correo_personal,
          dni: users.dni,
          legajo: users.legajo,
          telefono_personal: users.telefono_personal,
          status: users.status,
        })
        .from(users)
        .where(and(...whereConditions))
        .orderBy(desc(users.nombre))
        .limit(input.limit)
        .offset(offset);

      const totalResults = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(and(...whereConditions));

      return {
        results,
        total: totalResults.length,
        page: input.page,
        limit: input.limit,
      };
    }),

  getStudentById: enforceUserIsAdmin
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: users.id,
          nombre: users.nombre,
          apellido: users.apellido,
          correo_institucional: users.correo_institucional,
          correo_personal: users.correo_personal,
          dni: users.dni,
          legajo: users.legajo,
          telefono_personal: users.telefono_personal,
          status: users.status,
          rol: roles.nombre_rol,
        })
        .from(users)
        .where(eq(users.id, input.userId))
        .innerJoin(roles, eq(users.id_rol, roles.id_rol))
        .limit(1);

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario no encontrado",
        });
      }

      return result[0];
    }),
});
