import type { IncomingMessage, ServerResponse } from "node:http";

export default async function authHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    const { toNodeHandler } = await import("better-auth/node");
    const { auth } = await import("../../server/auth");
    await toNodeHandler(auth)(req, res);
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