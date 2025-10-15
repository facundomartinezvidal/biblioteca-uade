import { uuid, text } from "drizzle-orm/pg-core";

import { pgTable } from "drizzle-orm/pg-core";
import { books } from "./books";

export const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  createdAt: text("created_at").notNull(),
});
