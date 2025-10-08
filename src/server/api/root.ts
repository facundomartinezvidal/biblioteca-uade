import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { booksRouter } from "./routers/books";
import { loansRouter } from "./routers/loans";
import type {
  inferRouterInputs,
  inferRouterOutputs,
} from "node_modules/@trpc/server/dist/unstable-core-do-not-import.d-x-roAJpB.mjs";
import { documentationRouter } from "./routers/documentation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  loans: loansRouter,
  documentation: documentationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
