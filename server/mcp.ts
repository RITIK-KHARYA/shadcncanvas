import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

import { nodeRegistry, getNodesByCategory, categoryLabels } from "../src/lib/registry/node-registry.ts"

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

// ---------- Transport (entrypoint) ----------

async function main() {
  await server.connect(new StdioServerTransport())
}

main().catch((error) => {
  console.error("MCP server failed to start:", error)
  process.exit(1)
})
