import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  getAllParametersFromBackoffice,
  getParameterByNameFromBackoffice,
  getParametersByTypeFromBackoffice,
} from "~/lib/backoffice-api";

export const parametersRouter = createTRPCRouter({
  /**
   * Get all active parameters from backoffice
   */
  getAll: protectedProcedure.query(async () => {
    const parameters = await getAllParametersFromBackoffice();
    return parameters;
  }),

  /**
   * Get parameter by name from backoffice
   */
  getByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const parameter = await getParameterByNameFromBackoffice(input.name);
      return parameter;
    }),

  /**
   * Get parameters by type (multa or sancion) from backoffice
   */
  getByType: protectedProcedure
    .input(z.object({ type: z.enum(["multa", "sancion"]) }))
    .query(async ({ input }) => {
      const parameters = await getParametersByTypeFromBackoffice(input.type);
      return parameters;
    }),

  /**
   * Get all fines (multa type parameters)
   */
  getFines: protectedProcedure.query(async () => {
    const parameters = await getParametersByTypeFromBackoffice("multa");
    return parameters;
  }),

  /**
   * Get all sanctions (sancion type parameters)
   */
  getSanctions: protectedProcedure.query(async () => {
    const parameters = await getParametersByTypeFromBackoffice("sancion");
    return parameters;
  }),
});




