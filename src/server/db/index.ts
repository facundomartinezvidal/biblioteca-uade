import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load DB URL from environment
// Con moduleResolution "Bundler" + verbatimModuleSyntax, las rutas relativas deben llevar
// la extensión de runtime (.js). TypeScript resolverá el .ts correspondiente.
import * as schema from "./schema.js";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL no está configurada. Configurá DATABASE_URL o POSTGRES_URL(_NON_POOLING) en Vercel/Local.",
  );
}

const conn = globalForDb.conn ?? postgres(databaseUrl);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
