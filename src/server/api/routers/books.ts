import { publicProcedure } from "../trpc";
import type { RouterInput, RouterOutput } from "../root";
import { books } from "~/server/db/schemas";

export type getAllBooksInput = RouterInput["books"]["getAll"];
export type getAllBooksOutput = RouterOutput["books"]["getAll"];

export const booksRouter = {
  getAll: publicProcedure.query(({ ctx }) => {
    const result = ctx.db.select().from(books);
    return {
      success: true,
      method: "GET",
      response: result,
    };
  }),
};
