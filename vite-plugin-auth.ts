import type { Plugin } from "vite";

const AUTH_PATH = "/api/auth";

export default function authPlugin(): Plugin {
  return {
    name: "vite-plugin-auth",
    async configureServer(server) {
      const { auth } = await import("./server/auth");

      server.middlewares.use(AUTH_PATH, async (req, res) => {
        const path = `${AUTH_PATH}${req.url ?? "/"}`;
        const url = new URL(path, `http://${req.headers.host ?? "localhost"}`);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }

        let body: BodyInit | undefined;
        if (req.method !== "GET" && req.method !== "HEAD") {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
        }

        const request = new Request(url.toString(), {
          method: req.method,
          headers,
          body,
        });

        try {
          const response = await auth.handler(request);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          console.error("[auth middleware]", error);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });
    },
  };
}