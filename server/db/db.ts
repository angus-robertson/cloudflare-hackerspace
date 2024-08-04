import type { Context } from "hono";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

import type { Env } from "@server/env";
import * as schema from "./schema";

export const initializeDB = (c: Context<Env>) => {
  let db = c.get("db");
  if (!db) {
    db = drizzle(c.env.DB, { schema });
    c.set("db", db);
  }
  return db;
};

export type Database = DrizzleD1Database<typeof schema>;
