import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { loans } from "./loans";
import { sanctions } from "./sanctions";
import { penaltyStatusEnum } from "../enums";

export const penalties = pgTable("penalties", {
  id: uuid("id").defaultRandom().primaryKey(),
  sanctionId: uuid("sanction_id").references(() => sanctions.id),
  userId: uuid("user_id"),
  loanId: uuid("loan_id").references(() => loans.id),
  status: penaltyStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresIn: timestamp("expires_in", { withTimezone: false }),
});
