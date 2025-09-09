import { pgEnum } from "drizzle-orm/pg-core";

export const campusEnum = pgEnum("campus", ["MONSERRAT", "COSTA", "RECOLETA"]);

export const bookStatusEnum = pgEnum("book_status", [
  "AVAILABLE",
  "NOT_AVAILABLE",
  "RESERVED",
]);
