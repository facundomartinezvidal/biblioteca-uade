import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { bookStatusEnum } from "../enums";
import { authors } from "./authors";
import { genders } from "./genders";

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isbn: text("isbn").notNull().unique(),
  status: bookStatusEnum("book_status").notNull().default("AVAILABLE"),
  year: integer("year").notNull(),
  editorial: text("editorial").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => authors.id),
  genderId: uuid("gender_id")
    .notNull()
    .references(() => genders.id),
  locationId: text("location_id"),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
