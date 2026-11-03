import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

import { nodeRegistry, getNodesByCategory, categoryLabels } from "../src/lib/registry/node-registry.ts"
import {
  suggestConnections,
  findSafeConnections,
  validateConnection,
  loadConnections,
  suggestFormWiring,
  ComponentDef,
} from "../src/lib/connection-engine.ts"

// ---------------------------------------------------------------------------
// MCP API URL for the HTTP bridge (starts the website dev server)
// ---------------------------------------------------------------------------
const MCP_API_URL = process.env.MCP_API_URL || "http://localhost:5173/api"

const server = new McpServer({ name: "shadcncanvas", version: "1.0.0" })

// ---------- Tools ----------

server.tool(
  "list_components",
  "List the UI components available in the shadcncanvas graph editor. Optionally filter by category.",
  { category: z.string().optional().describe("Filter by component category (e.g. form, layout, charts)") },
  async ({ category }) => {
    const components = Object.values(nodeRegistry)
      .filter((component) => !category || component.category === category)
      .map(({ type, label, category, defaultProps }) => ({ type, label, category, defaultProps }))

    if (components.length === 0) {
      return {
        content: [{ type: "text", text: `No components found for category "${category}".` }],
        isError: true,
      }
    }

    return { content: [{ type: "text", text: JSON.stringify(components, null, 2) }] }
  },
)

server.tool(
  "get_component_schema",
  "Get the configurable properties and input/output ports for a graph component.",
  { component: z.string().describe("Component type, such as button or form") },
  async ({ component }) => {
    const definition = nodeRegistry[component]
    if (!definition) {
      return {
        content: [{ type: "text", text: `Unknown component: ${component}. Call list_components to see available types.` }],
        isError: true,
      }
    }

    const { type, label, category, defaultProps, configurableProps, inputs, outputs } = definition
    return {
      content: [{ type: "text", text: JSON.stringify({ type, label, category, defaultProps, configurableProps, inputs, outputs }, null, 2) }],
    }
  },
)

server.tool(
  "list_categories",
  "List all component categories available in the shadcncanvas graph editor.",
  {},
  async () => {
    const groups = getNodesByCategory()
    const result = Array.from(groups.entries()).map(([category, nodes]) => ({
      category,
      label: categoryLabels[category],
      count: nodes.length,
    }))
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
  },
)

// ---------- Resources ----------

server.resource(
  "components",
  "shadcncanvas://components",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(
          Array.from(getNodesByCategory().entries()).map(([category, nodes]) => ({
            category,
            label: categoryLabels[category],
            components: nodes.map((n) => ({ type: n.type, label: n.label })),
          })),
          null,
          2,
        ),
      },
    ],
  }),
)

// ---------- Prompts ----------

server.prompt(
  "build_form",
  "Generate a shadcncanvas form component graph from a list of field names.",
  { fields: z.string().describe("Comma-separated field names, e.g. 'name,email,password'") },
  async ({ fields }) => {
    const fieldList = fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean)

    if (fieldList.length === 0) {
      return {
        messages: [
          { role: "user", content: { type: "text", text: "No fields provided. Please supply comma-separated field names." } },
        ],
      }
    }

    const text = `Build a shadcncanvas form with these fields: ${fieldList.join(", ")}. Use the "form" component with inputs for each field, wire submit output, and set sensible defaults.`
    return { messages: [{ role: "user", content: { type: "text", text } }] }
  },
)

// ---------- Connection tools (intelligent wiring) ----------

server.tool(
  "suggest_connection",
  "Suggest a connection between two components. Given a source component and a target component, returns compatible input/output port matches with confidence scores and reasons.",
  {
    source: z.string().describe("Source component type, e.g. 'form' or 'input'"),
    target: z.string().describe("Target component type, e.g. 'input' or 'select'"),
  },
  async ({ source, target }) => {
    const def = nodeRegistry[source]
    if (!def) {
      return {
        content: [
          { type: "text", text: `Unknown source component: ${source}. Call list_components to see available types.` },
        ],
      }
    }
    const targetDef = nodeRegistry[target]
    if (!targetDef) {
      return {
        content: [
          { type: "text", text: `Unknown target component: ${target}. Call list_components to see available types.` },
        ],
      }
    }
    const targetComponent: ComponentDef = {
      id: target,
      label: targetDef.label,
      category: targetDef.category,
      inputs: targetDef.inputs,
      outputs: targetDef.outputs,
      defaultProps: targetDef.defaultProps,
      schemaKey: target,
    }
    const suggestions = suggestConnections(source, [targetComponent])
    const safe = findSafeConnections(source)
    const all = loadConnections()
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              source: def.type,
              sourceLabel: def.label,
              target: targetDef.type,
              targetLabel: targetDef.label,
              suggestions: suggestions.slice(0, 10),
              targetSafeConnections: safe,
              allConnections: all,
            },
            null,
            2,
          ),
        },
      ],
    }
  },
)

server.tool(
  "find_safe_connections",
  "Find all type-safe connection candidates for a given source component across the whole registry. Returns ranked suggestions sorted by compatibility score.",
  { component: z.string().describe("Component type, e.g. 'form' or 'apiCall'") },
  async ({ component }) => {
    const safe = findSafeConnections(component)
    const def = nodeRegistry[component]
    if (!def) {
      return {
        content: [
          { type: "text", text: `Unknown component: ${component}. Call list_components to see available types.` },
        ],
      }
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ component: def.type, label: def.label, category: def.category, safeConnections: safe, totalSuggestions: safe.length }, null, 2),
        },
      ],
    }
  },
)

server.tool(
  "validate_connection",
  "Validate a proposed component connection. Checks that both components exist, that the ports exist, and that the data types are compatible.",
  {
    source: z.string().describe("Source component type"),
    sourcePort: z.string().describe("Source port key, e.g. 'value' or 'submitted'"),
    target: z.string().describe("Target component type"),
    targetPort: z.string().describe("Target port key, e.g. 'payload'"),
  },
  async ({ source, sourcePort, target, targetPort }) => {
    const { ok, errors, suggestions, score } = validateConnection(source, sourcePort, target, targetPort)
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ok, errors, suggestions: suggestions.slice(0, 5), score }, null, 2),
        },
      ],
    }
  },
)


server.tool(
  "suggest_form",
  "Generate an intelligent form wiring plan. Suggests how to connect form fields, validation, and submission using component outputs and inputs.",
  { fields: z.string().describe("Comma-separated field names, e.g. 'name,email,password'") },
  async ({ fields }) => {
    const fieldList = fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean)

    if (fieldList.length === 0) {
      return {
        content: [{ type: "text", text: "No fields provided. Please supply comma-separated field names." }],
        isError: true,
      }
    }

    // Map field names to registry component types (form fields are usually 'input', 'select', 'checkbox', etc.)
    const fieldComponents: Record<string, string> = {
      name: "input",
      email: "input",
      password: "input",
      number: "input",
      text: "input",
      checkbox: "checkbox",
      switch: "switch",
      select: "select",
      textarea: "textarea",
      date: "calendar",
      phone: "input",
      url: "input",
    }

    const usedFields: string[] = []
    const connections: string[] = []

    for (const field of fieldList) {
      const type = fieldComponents[field.toLowerCase()] || "input"
      if (!usedFields.includes(type)) {
        usedFields.push(type)
        connections.push(`    ${type} (value) → form payload (data binding)`)
      }
    }

    const suggestions = suggestFormWiring(usedFields)

    return {
      content: [
        {
          type: "text",
          text: `Build a shadcncanvas form with fields: ${fieldList.join(", ")}.\n\nIntelligence recommendations:\n${suggestions.map((s) => `  • ${s.sourceId}.${s.sourcePort} → ${s.targetId}.${s.targetPort} (${s.reason})`).join("\n")}\n\nSuggested wiring plan:\n${connections.join("\n")}`,
        },
      ],
    }
  },
)

// ============================================================================
// MCP Tool: create_component
// Streams a component to the website canvas via the HTTP bridge
// ============================================================================

server.tool(
  "create_component",
  "Create a component on the website canvas via the HTTP bridge. The component appears live on the website.",
  {
    componentType: z.string().describe("Component type, e.g. 'button', 'input', 'form'"),
    props: z.record(z.string(), z.any()).optional().describe("Optional props to override defaults"),
  },
  async ({ componentType, props = {} }) => {
    try {
      const response = await fetch(`${MCP_API_URL}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentType, props }),
      })
      const data = await response.json()
      if (!response.ok) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ ok: false, error: data.error }, null, 2),
          }],
        }
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            ok: true,
            message: `Component "${data.componentType}" created on canvas`,
            nodeId: data.nodeId,
            componentType: data.componentType,
            label: data.label,
          }, null, 2),
        }],
      }
    } catch (err) {
      return {
        content: [{
          type: "text",
        text: JSON.stringify({ ok: false, error: String(err) }, null, 2),
      }],
      }
    }
  }
)

// ============================================================================
// MCP Tool: create_connection
// Creates a data connection between two components. Source output flows to target input.
// ============================================================================
server.tool(
  "create_connection",
  "Create a data connection between two components. The source component's output value flows through this connection to the target component's input. Validates type compatibility before creating the edge.",
  {
    source: z.string().describe("Source component type, e.g. 'input' or 'form'"),
    sourcePort: z.string().describe("Source port key, e.g. 'value' or 'payload'"),
    target: z.string().describe("Target component type, e.g. 'form' or 'card'"),
    targetPort: z.string().describe("Target port key, e.g. 'payload' or 'data'"),
    transform: z.string().optional().describe("Transform to apply to the value (e.g. 'invert', 'negate')"),
  },
  async ({ source, sourcePort, target, targetPort, transform }) => {
    try {
      const response = await fetch(`${MCP_API_URL}/connections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, sourcePort, target, targetPort, transform }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          content: [{ type: "text", text: JSON.stringify({ ok: false, error: data.error }, null, 2) }],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify({ ok: true, connection: data.connection }, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: JSON.stringify({ ok: false, error: String(err) }, null, 2) }],
      };
    }
  },
);

server.tool(
  "list_connections",
  "List all saved component connections (edges) in the graph store.",
  {},
  async () => {
    try {
      const response = await fetch(`${MCP_API_URL}/connections`);
      const data = await response.json();
      if (!response.ok) {
        return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: data.error }, null, 2) }] };
      }
      return { content: [{ type: "text", text: JSON.stringify(data.connections, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: String(err) }, null, 2) }] };
    }
  },
);

server.tool(
  "delete_connection",
  "Delete a connection (edge) from the graph store.",
  { connectionId: z.string().describe("Connection ID, e.g. 'conn_1234567890'") },
  async ({ connectionId }) => {
    try {
      const response = await fetch(`${MCP_API_URL}/connections/${connectionId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: data.error }, null, 2) }] };
      }
      return { content: [{ type: "text", text: JSON.stringify({ ok: true, message: "Connection deleted" }, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: String(err) }, null, 2) }] };
    }
  },
);

// ---------- Transport (entrypoint) ----------

async function main() {
  await server.connect(new StdioServerTransport())
}

main().catch((error) => {
  console.error("MCP server failed to start:", error)
  process.exit(1)
})
