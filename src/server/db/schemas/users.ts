import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  apellido: text("apellido").notNull(),
  correo_institucional: text("correo_institucional").notNull(),
  correo_personal: text("correo_personal").notNull(),
  dni: text("dni").notNull(),
  legajo: text("legajo").notNull(),
  nombre: text("nombre").notNull(),
  status: boolean("status").notNull(),
  telefono_personal: text("telefono_personal").notNull(),
});
