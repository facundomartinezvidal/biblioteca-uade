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

export const notificationTypeEnum = pgEnum("notification_type", [
  "LOANS_DEADLINE",
  "LOANS_EXPIRED",
  "USER_PENALIZED",
]);
