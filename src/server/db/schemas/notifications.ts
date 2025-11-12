import { pgTable, uuid, timestamp, text, boolean } from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "../enums";
import { users } from "./users";
import { loans } from "./loans";
import { penalties } from "./penalties";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  loanId: uuid("loan_id").references(() => loans.id),
  penaltyId: uuid("penalty_id").references(() => penalties.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
