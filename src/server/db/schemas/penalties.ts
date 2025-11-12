import {
  pgTable,
  uuid,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { loans } from "./loans";

export const penalties = pgTable("penalties", {
  id: uuid("id").defaultRandom().primaryKey(),
  sanctionId: uuid("sanction_id"),
  userId: uuid("user_id"),
  loanId: uuid("loan_id").references(() => loans.id),
  amount: numeric("amount"),
  paid: boolean("paid"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresIn: timestamp("expires_in", { withTimezone: false }),
});
