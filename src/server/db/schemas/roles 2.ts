import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id_rol: uuid("id_rol").notNull().primaryKey(),
  nombre_rol: text("nombre_rol").notNull(),
  descripcion: text("descripcion").notNull(),
  subcategoria: text("subcategoria").notNull(),
  sueldo_base: text("sueldo_base").notNull(),
  status: boolean("status").notNull(),
});
