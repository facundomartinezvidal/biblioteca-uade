import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterOutput } from "../root";
import { TRPCError } from "@trpc/server";
import {
  getUserFromBackoffice,
  getStudentsFromBackoffice,
  getStudentByIdFromBackoffice,
} from "~/lib/backoffice-api";
import { z } from "zod";

export type getUserOutput = RouterOutput["user"]["getUser"];

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    // Fetch user from backoffice instead of local DB
    const email = ctx.user.email;

    try {
      const backofficeUser = await getUserFromBackoffice(email);

      if (!backofficeUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuario no encontrado en backoffice",
        });
      }

      return {
        name: backofficeUser.nombre,
        last_name: backofficeUser.apellido,
        institutional_email: backofficeUser.email_institucional,
        personal_email: backofficeUser.email_personal,
        phone: backofficeUser.telefono_personal,
        identity_card: backofficeUser.dni,
        legacy_number: backofficeUser.legajo,
        role: backofficeUser.rol.categoria,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al obtener usuario del backoffice",
        cause: error,
      });
    }
  }),

  getAllStudents: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { users, total } = await getStudentsFromBackoffice({
          page: input.page,
          limit: input.limit,
          search: input.search,
        });

        // Transform to match the expected format
        const results = users.map((user) => ({
          id: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          correo_institucional: user.email_institucional,
          correo_personal: user.email_personal,
          dni: user.dni,
          legajo: user.legajo,
          telefono_personal: user.telefono_personal,
          status: user.status,
        }));

        return {
          results,
          total,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener estudiantes del backoffice",
          cause: error,
        });
      }
    }),

  getStudentById: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const student = await getStudentByIdFromBackoffice(input.userId);

        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Estudiante no encontrado",
          });
        }

        // Transform to match the expected format
        return {
          id: student.id_usuario,
          nombre: student.nombre,
          apellido: student.apellido,
          correo_institucional: student.email_institucional,
          correo_personal: student.email_personal,
          dni: student.dni,
          legajo: student.legajo,
          telefono_personal: student.telefono_personal,
          status: student.status,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener estudiante del backoffice",
          cause: error,
        });
      }
    }),
});
