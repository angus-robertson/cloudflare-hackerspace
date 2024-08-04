import type { DrizzleD1Database } from "drizzle-orm/d1";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = sqliteTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    email: text("email").notNull().unique(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    password: text("password").notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(usersTable);
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(usersTable);

// TODO: move these to another file
export const insertUser = async (db: DrizzleD1Database, user: typeof usersTable.$inferInsert) => {
  return db.insert(usersTable).values(user);
};

export const getUser = async (db: DrizzleD1Database, email: string) => {
  return db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
};
