import type { IncomingMessage, ServerResponse } from "node:http";
import { betterAuth, type Auth } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { createAuthOptions, createDatabase } from "../../server/auth-config";

let cached: Auth | null = null;

function getAuth(): Auth {
  if (!cached) {
    cached = betterAuth(createAuthOptions(createDatabase()));
  }
  return cached;
}

export default async function authHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    await toNodeHandler(getAuth())(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[auth function]", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: message }));
    } else {
      res.end();
    }
  }
}