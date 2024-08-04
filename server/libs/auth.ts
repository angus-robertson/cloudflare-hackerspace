import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { env } from "hono/adapter";
import type { InferSelectModel } from "drizzle-orm";
import type { Context } from "hono";

import type { Env } from "@server/env";
import { sessionsTable } from "../db/schema/sessions";
import { usersTable } from "../db/schema/users";

export const initializeLucia = (c: Context<Env>) => {
  let lucia = c.get("lucia");
  if (!lucia) {
    const db = c.get("db");
    const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

    lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: env(c).WORKER_ENV !== "development",
        },
      },
      getUserAttributes: (attributes) => {
        return {
          id: attributes.id,
          email: attributes.email,
          firstName: attributes.firstName,
          lastName: attributes.lastName,
        };
      },
    });

    c.set("lucia", lucia);
  }

  return lucia;
};

export type DatabaseUserAttributes = Omit<InferSelectModel<typeof usersTable>, "password">;

export const hashPassword = async (password: string, providedSalt?: Uint8Array): Promise<string> => {
  const encoder = new TextEncoder();
  const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exportedKey = (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer;
  const hashBuffer = new Uint8Array(exportedKey);
  const hashArray = Array.from(hashBuffer);
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
};

export async function verifyPassword(storedHash: string, passwordAttempt: string): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(":");
  const matchResult = saltHex.match(/.{1,2}/g);
  if (!matchResult) {
    throw new Error("Invalid salt format");
  }
  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  const attemptHashWithSalt = await hashPassword(passwordAttempt, salt);
  const [, attemptHash] = attemptHashWithSalt.split(":");
  return attemptHash === originalHash;
}
