import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text } from "drizzle-orm/pg-core";
import { campusEnum } from "../enums";

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: text("address").notNull(),
  campus: campusEnum("campus").notNull(),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
