import { pgEnum } from "drizzle-orm/pg-core";

export const campusEnum = pgEnum("campus", ["MONSERRAT", "COSTA", "RECOLETA"]);

export const bookStatusEnum = pgEnum("book_status", [
  "AVAILABLE",
  "NOT_AVAILABLE",
  "RESERVED",
]);

export const loanStatusEnum = pgEnum("loan_status", [
  "RESERVED",
  "ACTIVE",
  "FINISHED",
  "EXPIRED",
  "CANCELLED",
]);

export const userParameterStatusEnum = pgEnum("user_parameter_status", [
  "PENDING",
  "PAID",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "LOAN_DEADLINE",
  "LOAN_EXPIRED",
  "PENALTY_APPLIED",
  "PENALTY_DEADLINE",
  "PENALTY_EXPIRED",
]);
