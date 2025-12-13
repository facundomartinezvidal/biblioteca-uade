import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { loans } from "./loans";
import { userParameterStatusEnum } from "../enums";

export const userParameters = pgTable("user_parameters", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  loanId: uuid("loan_id").references(() => loans.id),
  parameterId: varchar("parameter_id", { length: 255 }).notNull(), // ID from backoffice parameters
  status: userParameterStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  parentId: uuid("parent_id"),
});

