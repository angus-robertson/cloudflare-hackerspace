import { Hono } from "hono";
import { logger } from "hono/logger";
import { csrf } from "hono/csrf";
import { trimTrailingSlash } from "hono/trailing-slash";

import { Env } from "@server/env";
import { challengesHandler } from "./handlers/challenges";
import { authHandler } from "./handlers/auth";
import { withLucia } from "./middeware";

const app = new Hono<Env>()
  .basePath("/api/v1")
  .use(logger())
  .use(csrf())
  .use(trimTrailingSlash())
  .use(withLucia()) // TODO: might be able to only load DB/Lucia for specific routes that need them?
  .get("/ping", (c) => {
    return c.json({
      data: "pong!",
    });
  })
  .route("/auth", authHandler)
  .route("/challenges", challengesHandler);

type App = typeof app;

export { app };
export type { App };
