import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load DB URL from environment
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Prefer a pooled/pgbouncer URL to avoid exhausting session connections.
// SUPABASE_DB_POOL_URL is optional but recommended to point explicitly to the pooler connection string.
const databaseUrl =
  process.env.SUPABASE_DB_POOL_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL no está configurada. Configurá DATABASE_URL o POSTGRES_URL(_NON_POOLING) en Vercel/Local.",
  );
}

// Use conservative pool settings and disable prepared statements for PgBouncer compatibility
// See: https://supabase.com/docs/guides/database/connecting/pgbouncer
const conn =
  globalForDb.conn ??
  postgres(databaseUrl, {
    // Limit concurrent connections from this process (helpful in dev & serverless)
    max: Number.parseInt(process.env.DB_MAX_CONNECTIONS ?? "5", 10),
    // Disable prepared statements when going through PgBouncer transaction pooling
    prepare: false,
    // Optional timeouts (in seconds)
    idle_timeout: 20,
    connect_timeout: 10,
  });
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
