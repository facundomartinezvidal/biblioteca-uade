import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text } from "drizzle-orm/pg-core";

export const editorials = pgTable("editorials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export type Editorial = typeof editorials.$inferSelect;
export type NewEditorial = typeof editorials.$inferInsert;
