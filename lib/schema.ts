import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  total: integer("total").notNull().default(0),
  breakdown: text("breakdown").notNull().default("{}"),
  messagesScanned: integer("messages_scanned").notNull().default(0),
  conversationsScanned: integer("conversations_scanned").notNull().default(0),
  topWord: text("top_word"),
  userToken: text("user_token"),
  submittedAt: text("submitted_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
