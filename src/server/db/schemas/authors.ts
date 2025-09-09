import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  middleName: text("middleName"),
  lastName: text("lastName").notNull(),
  createdAt: text("created_at").notNull(),
});
