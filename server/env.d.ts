import type { Env } from "hono";
import type { Lucia, User, Session } from "lucia";

import type { Database } from "./db/db";
import type { DatabaseUserAttributes, initializeLucia } from "./libs/auth";

type Environment = Env & {
  Bindings: {
    WORKER_ENV: "production" | "development";
    DB: D1Database;
  };
  Variables: {
    db: Database;
    user: (User & DatabaseUserAttributes) | null;
    session: Session | null;
    lucia: Lucia<DatabaseUserAttributes>;
  };
};

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type TUser = User & DatabaseUserAttributes;

export { Environment as Env, TUser as User };
