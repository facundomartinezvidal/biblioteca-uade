import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { randomUUID } from "crypto";
import type { RouterInput } from "../root";

export type getAllBooksInput = RouterInput["documentation"]["books"]["getAll"];

export const documentationRouter = createTRPCRouter({
  books: createTRPCRouter({
    getAll: publicProcedure
      .input(
        z.object({ page: z.number().optional(), limit: z.number().optional() }),
      )
      .query(() => {
        return {
          method: "GET",
          endpoint: "/books/getAll",
          description: "Obtiene todos los libros",
          response: {
            results: [
              {
                id: randomUUID(),
                title: "Clean Code",
                author: "Robert C. Martin",
                description: "A book about clean code",
                isbn: "978-0132350884",
                status: "AVAILABLE",
                createdAt: new Date().toISOString(),
              },
              {
                id: randomUUID(),
                title: "Clean Agile",
                author: "Robert C. Martin",
                description: "A book about clean agile",
                isbn: "978-0132350884",
                status: "AVAILABLE",
                createdAt: new Date().toISOString(),
              },
            ],
            total: 2,
            page: 1,
            limit: 10,
          },
        };
      }),
  }),
});
