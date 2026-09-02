import type { ServerResponse } from "node:http";

export default function handler(
  // req: IncomingMessage,
  res: ServerResponse,
) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify({
    ok: true,
    databaseUrlExists: !!process.env.DATABASE_URL,
    secretExists: !!process.env.BETTER_AUTH_SECRET,
  }));
}