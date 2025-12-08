import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterOutput } from "../root";
import { TRPCError } from "@trpc/server";
import { getUserFromBackoffice } from "~/lib/backoffice-api";

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
});
