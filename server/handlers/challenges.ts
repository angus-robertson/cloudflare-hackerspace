import { Hono } from "hono";

import type { Env } from "@server/env";

export const challengesHandler = new Hono<Env>()
  .get("/", (c) => {
    return c.text("hi");
  })
  .post("/", (c) => {
    return c.text("hi");
  })
  .get("/:id", (c) => {
    return c.text("hi");
  });
