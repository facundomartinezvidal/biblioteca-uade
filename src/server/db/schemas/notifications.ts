import { pgTable, uuid, timestamp, text, boolean } from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "../enums";
import { loans } from "./loans";
import { userParameters } from "./user-parameters";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  loanId: uuid("loan_id").references(() => loans.id),
  penaltyId: uuid("penalty_id").references(() => userParameters.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
