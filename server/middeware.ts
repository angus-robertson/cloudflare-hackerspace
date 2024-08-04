import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { User } from "lucia";

import type { Env } from "@server/env";
import { initializeLucia, type DatabaseUserAttributes } from "./libs/auth";
import { initializeDB } from "./db/db";

export const withDB = () =>
  createMiddleware<Env>((c, next) => {
    initializeDB(c);
    return next();
  });

export const withLucia = () =>
  createMiddleware<Env>((c, next) => {
    initializeDB(c);
    initializeLucia(c);
    return next();
  });

export const withAuth = () =>
  createMiddleware<Env>(async (c, next) => {
    const lucia = c.get("lucia");

    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
    if (!sessionId) {
      console.log("UNAUTHORIZED: No session ID.");
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
        append: true,
      });
    }

    if (!session) {
      console.log("UNAUTHORIZED: No session.");
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }

    c.set("user", user as User & DatabaseUserAttributes);
    c.set("session", session);
    await next();
  });
