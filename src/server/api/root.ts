import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { booksRouter } from "./routers/books";
import { loansRouter } from "./routers/loans";
import type {
  inferRouterInputs,
  inferRouterOutputs,
} from "node_modules/@trpc/server/dist/unstable-core-do-not-import.d-x-roAJpB.mjs";
import { documentationRouter } from "./routers/documentation";
import { authRouter } from "./routers/auth";
import { catalogRouter } from "./routers/catalog";
import { userRouter } from "./routers/user";
import { favoritesRouter } from "./routers/favorites";
import { penaltiesRouter } from "./routers/penalties";
import { sanctionsRouter } from "./routers/sanctions";
import { dashboardRouter } from "./routers/dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  loans: loansRouter,
  documentation: documentationRouter,
  auth: authRouter,
  catalog: catalogRouter,
  user: userRouter,
  favorites: favoritesRouter,
  penalties: penaltiesRouter,
  sanctions: sanctionsRouter,
  dashboard: dashboardRouter,
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
