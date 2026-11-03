// server/mcp-event-hub.ts
// Server-sent events hub that pushes canvas mutations made through the MCP
// HTTP bridge to connected browser clients.

type SseResponse = {
  setHeader: (name: string, value: string) => void
  flushHeaders?: () => void
  write: (chunk: string) => void
}

type SseRequest = {
  on: (event: string, listener: () => void) => void
}

type Client = {
  res: SseResponse
  heartbeat: ReturnType<typeof setInterval>
}

const clients = new Set<Client>()

function serialize(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

function drop(client: Client) {
  clearInterval(client.heartbeat)
  clients.delete(client)
}

export function emitEvent(event: string, data: unknown) {
  const payload = serialize(event, data)
  for (const client of clients) {
    try {
      client.res.write(payload)
    } catch {
      drop(client)
    }
  }
}

export function sseHandler(getSnapshot: () => unknown) {
  return (req: SseRequest, res: SseResponse) => {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache, no-transform")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders?.()

    const client: Client = {
      res,
      heartbeat: setInterval(() => {
        try {
          res.write(": ping\n\n")
        } catch {
          drop(client)
        }
      }, 15_000),
    }

    clients.add(client)
    res.write(serialize("snapshot", getSnapshot()))

    req.on("close", () => drop(client))
    req.on("error", () => drop(client))
  }
}

export function connectedClientCount(): number {
  return clients.size
}
