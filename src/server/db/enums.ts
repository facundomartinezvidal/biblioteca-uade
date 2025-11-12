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

export const penaltyStatusEnum = pgEnum("penalty_status", [
  "PENDING",
  "PAID",
  "EXPIRED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "LOANS_DEADLINE",
  "LOANS_EXPIRED",
  "USER_PENALIZED",
]);

export const sanctionTypeEnum = pgEnum("sanction_type", [
  "LIBRO_DANADO",
  "RETIRO_ATRASADO",
  "DEVOLUCION_TARDIA",
  "RESERVA_CANCELADA",
  "PAGO_ATRASADO",
]);
