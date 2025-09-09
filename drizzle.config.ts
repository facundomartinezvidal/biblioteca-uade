import { type Config } from "drizzle-kit";
import "dotenv/config";

// Nota:
// 1. Pasamos a usar un array/glob para que drizzle-kit incluya todos los archivos
//    donde definís tablas y enums (enums.ts, schema.ts y carpeta schemas/*).
// 2. Eliminamos tablesFilter porque estaba filtrando tablas que no empiezan con
//    el prefijo "next-trpc-drizzle-supabase_" (por eso no aparecían tus nuevas tablas).
// 3. Si querés re‑agregar un filtro, usá nombres que coincidan con tus tablas reales.

export default {
  schema: [
    "./src/server/db/enums.ts",
    "./src/server/db/schema.ts",
    "./src/server/db/schemas/*.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
