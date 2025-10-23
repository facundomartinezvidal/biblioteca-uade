import { pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
export const user_roles = pgTable("user_roles", {
  id_rol: uuid("id_rol").notNull(),
  id_usuario: uuid("id_usuario")
    .notNull()
    .references(() => users.id)
    .notNull(),
});
