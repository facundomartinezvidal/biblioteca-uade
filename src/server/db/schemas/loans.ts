import { pgTable, uuid } from "drizzle-orm/pg-core";
import { books } from "./books";
import { text } from "drizzle-orm/pg-core";
import { loanStatusEnum } from "../enums";

export const loans = pgTable("loans", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  userId: uuid("user_id").notNull(),
  endDate: text("end_date").notNull(),
  status: loanStatusEnum("status").notNull().default("RESERVED"),
  createdAt: text("created_at").notNull(),
});
