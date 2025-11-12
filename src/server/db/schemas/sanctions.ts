import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { sanctionTypeEnum } from "../enums";

export const sanctions = pgTable("sanctions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: sanctionTypeEnum("type").notNull(),
  description: text("description"),
  amount: numeric("amount").notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
