import type { IncomingMessage, ServerResponse } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../server/auth";

const handler = toNodeHandler(auth);

export default async function authHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    await handler(req, res);
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