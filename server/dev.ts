// server/dev.ts — Dev entry point that serves the Vite app AND provides
// the HTTP bridge for MCP tools to create components on the canvas.
//
// The Express API server handles /api/* routes. Non-API routes are handled
// by the Vite dev server (attached as final middleware).

import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { nodeRegistry } from "../src/lib/registry/node-registry.ts"
import { useGraphStore } from "../src/store/graph-store.ts"
import { emitEvent, sseHandler } from "./mcp-event-hub.ts"
import type { CanvasNode } from "../src/types/graph.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, "..")
const SRC = path.resolve(ROOT, "src")

async function main() {
  console.log("Starting dev server with MCP bridge…")

  // ── Start Vite dev server on port 5174 ────────────────────────────────
  const vite = await import("vite")
  const viteServer = await vite.createServer({
    root: ROOT,
    server: {
      port: 5174,
      host: false,
      hmr: { port: 5175 },
      proxy: {
        "/api": {
          target: "http://localhost:5173",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": SRC,
      },
    },
  })

  // Vite middleware is attached to Express below, after all API routes.
  await viteServer.listen(5174);

  // ── Express API server on port 5173 ───────────────────────────────────
  const app = express()
  app.use(express.json())

  // GET /api/health
  app.get("/api/health", (_req: any, res: any) => {
    res.json({ ok: true, time: new Date().toISOString() })
  })

  // GET /api/events — server-sent events stream of canvas mutations
  app.get(
    "/api/events",
    sseHandler(() => {
      const { nodes, edges, connections } = useGraphStore.getState()
      return { nodes, edges, connections }
    }),
  )

  // POST /api/nodes — create a component on the canvas
  app.post("/api/nodes", async (req: any, res: any) => {
    try {
      const body = req.body as { componentType?: string; props?: Record<string, unknown> }
      const { componentType, props = {} } = body
      if (!componentType) {
        return res.status(400).json({ ok: false, error: "componentType required" })
      }
      const config = nodeRegistry[componentType]
      if (!config) {
        return res.status(404).json({ ok: false, error: `Unknown component: ${componentType}` })
      }
      const state = useGraphStore.getState()
      const index = state.nodes.length
      const nodeId = crypto.randomUUID()
      const canvasNode: CanvasNode = {
        id: nodeId,
        type: "baseNode",
        position: {
          x: 80 + (index % 4) * 320,
          y: 80 + Math.floor(index / 4) * 240,
        },
        data: {
          componentType,
          props: { ...config.defaultProps, ...props },
          state: {},
          layout: { sizeMode: "default" },
        },
      }
      state.addNode(canvasNode)
      emitEvent("node.added", canvasNode)
      res.json({
        ok: true,
        nodeId,
        componentType,
        label: config.label,
        props: canvasNode.data.props,
      })
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) })
    }
  })

  // GET /api/nodes — list current canvas nodes
  app.get("/api/nodes", async (_req: any, res: any) => {
    try {
      const nodes = useGraphStore.getState().nodes
      res.json({ ok: true, nodes })
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) })
    }
  })

  // ============================================================================
  // Connection API routes
  // ============================================================================
  // POST /api/connections — create a connection
  app.post("/api/connections", async (req: any, res: any) => {
    try {
      const body = req.body as { source?: string; sourcePort?: string; target?: string; targetPort?: string; transform?: string }
      const { source, sourcePort, target, targetPort, transform } = body
      if (!source || !sourcePort || !target || !targetPort) {
        return res.status(400).json({ ok: false, error: "source, sourcePort, target, targetPort required" })
      }
      const state = useGraphStore.getState()
      const sourceNode = [...state.nodes]
        .reverse()
        .find((node) => node.data.componentType === source)
      const targetNode = [...state.nodes]
        .reverse()
        .find((node) => node.data.componentType === target)
      const connection = state.addConnection({
        sourceId: source,
        sourcePort: sourcePort,
        targetId: target,
        targetPort: targetPort,
        transform,
        sourceNodeId: sourceNode?.id,
        targetNodeId: targetNode?.id,
      })
      emitEvent("connection.added", connection)
      res.json({ ok: true, connection })
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) })
    }
  })

  // GET /api/connections — list all connections
  app.get("/api/connections", async (_req: any, res: any) => {
    try {
      const connections = useGraphStore.getState().connections
      res.json({ ok: true, connections })
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) })
    }
  })

  // DELETE /api/connections/:id — delete a connection
  app.delete("/api/connections/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params
      const state = useGraphStore.getState()
      const removed = state.removeConnection(id)
      if (!removed) {
        return res.status(404).json({ ok: false, error: "Connection not found" })
      }
      res.json({ ok: true, message: "Connection deleted" })
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) })
    }
  })

  // Attach Vite middleware as the final Express middleware (after all API routes).
  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith("/api/")) return next()
    viteServer.middlewares(req, res, next)
  })

  const PORT = Number(process.env.PORT) || 5173
  app.listen(PORT, "localhost", () => {
    console.log(`  MCP API:        http://localhost:${PORT}/ (MCP bridge)`)
    console.log(`  Vite app:       http://localhost:5174/ (proxied via /)`)
    console.log(`  Vite HMR:       ws://localhost:5175`)
  })
}

main().catch((err) => {
  console.error("Dev server failed:", err)
  process.exit(1)
})
