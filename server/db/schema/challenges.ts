import { sqliteTable, text, uniqueIndex, index, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const challengesTable = sqliteTable(
  "challenges",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull().unique(),
    description: text("desc"),
    approved: integer("approved", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => ({
    nameIdx: uniqueIndex("name_idx").on(table.name),
    approvedIdx: index("approved_idx").on(table.approved),
  })
);

// Schemas
const insertChallengeSchema = createInsertSchema(challengesTable);
const selectChallengeSchema = createSelectSchema(challengesTable);

// Functions

export { challengesTable as challenges, insertChallengeSchema, selectChallengeSchema };
