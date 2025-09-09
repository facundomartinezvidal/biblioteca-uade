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

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
