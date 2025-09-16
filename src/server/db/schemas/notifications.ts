import { pgTable, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { notificationTypeEnum } from "../enums";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  type: notificationTypeEnum("notification_type").notNull(),
  createdAt: text("created_at").notNull(),
});
