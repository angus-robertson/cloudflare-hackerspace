import { Hono } from "hono";

import { generateIdFromEntropySize } from "lucia";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import type { Env } from "@server/env";
import { withAuth } from "../middeware";
import { users, selectUserSchema } from "../db/schema";
import { hashPassword, verifyPassword } from "../libs/auth";

export const authHandler = new Hono<Env>()
  .post(
    "/login",
    zValidator("json", selectUserSchema.pick({ email: true, password: true }), (result, c) => {
      if (!result.success) {
        return c.json({ error: "invalid/missing email or password" }, StatusCodes.BAD_REQUEST);
      }
    }),
    async (c) => {
      const db = c.get("db");
      const lucia = c.get("lucia");

      const { email, password } = c.req.valid("json");

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        // verify a random password to avoid timing differential between finding an email or not
        await verifyPassword("96a6864b351027ebb64fa0ae10ea04e2:c15b5d6dcce767fc570822ac839aa18a37241b2379db2e47bdfa6e4a594801d0", password);
        return c.json({ error: "invalid email or password" }, StatusCodes.BAD_REQUEST);
      }

      const validPassword = await verifyPassword(user.password, password);
      if (!validPassword) return c.json({ error: "invalid email or password" }, StatusCodes.BAD_REQUEST);

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });

      return c.json(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        StatusCodes.OK
      );
    }
  )
  .post(
    "/signup",
    zValidator("json", selectUserSchema.pick({ email: true, password: true, firstName: true, lastName: true }), (result, c) => {
      if (!result.success) {
        return c.json({ error: "invalid or missing email, password, firstname or lastname" }, StatusCodes.BAD_REQUEST);
      }
    }),
    async (c) => {
      const db = c.get("db");
      const lucia = c.get("lucia");

      const { email, password, firstName, lastName } = c.req.valid("json");
      console.log("email: ", email);
      console.log("password: ", password);
      console.log("firstName: ", firstName);
      console.log("lastName: ", lastName);

      const hashedPassword = await hashPassword(password);
      const id = generateIdFromEntropySize(16);

      try {
        await db.insert(users).values({
          id: id,
          email,
          firstName,
          lastName,
          password: hashedPassword,
        });

        const session = await lucia.createSession(id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        c.header("Set-Cookie", sessionCookie.serialize(), {
          append: true,
        });

        return c.json(
          {
            id,
            email,
            firstName,
            lastName,
          },
          StatusCodes.OK
        );
      } catch (err) {
        console.log("Error: ", err);

        return c.json({ error: "email already in use" }, StatusCodes.CONFLICT);
      }
    }
  )
  .post("/logout", withAuth(), async (c) => {
    const session = c.get("session");
    if (!session) return c.json({ error: "not logged in" }, StatusCodes.UNAUTHORIZED);
    const lucia = c.get("lucia");

    await lucia.invalidateSession(session.id);

    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });

    return c.body(null, StatusCodes.OK);
  })
  .get("/me", withAuth(), (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "not logged in" }, StatusCodes.UNAUTHORIZED);
    return c.json(user, StatusCodes.OK);
  });
