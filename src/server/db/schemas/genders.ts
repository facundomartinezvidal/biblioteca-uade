import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text } from "drizzle-orm/pg-core";

export const genders = pgTable("genders", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;
