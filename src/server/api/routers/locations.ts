import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getLocationFromBackoffice,
  getAllLocationsFromBackoffice,
} from "~/lib/backoffice-api";

export const locationsRouter = createTRPCRouter({
  /**
   * Get location by ID from backoffice
   */
  getById: publicProcedure
    .input(z.object({ locationId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const location = await getLocationFromBackoffice(input.locationId);

        if (!location) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sede no encontrada",
          });
        }

        return {
          id: location.id_sede,
          name: location.nombre,
          address: location.ubicacion,
          status: location.status,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener sede del backoffice",
          cause: error,
        });
      }
    }),

  /**
   * Get all locations from backoffice
   */
  getAll: publicProcedure.query(async () => {
    try {
      const locations = await getAllLocationsFromBackoffice();

      return locations
        .filter((location) => location.status) // Only return active locations
        .map((location) => ({
          id: location.id_sede,
          name: location.nombre,
          address: location.ubicacion,
          status: location.status,
        }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al obtener sedes del backoffice",
        cause: error,
      });
    }
  }),
});


