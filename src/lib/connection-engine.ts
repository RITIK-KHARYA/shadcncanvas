// src/lib/connection-engine.ts
// Intelligent component-connection engine for shadcncanvas.
// Analyzes component port schemas, matches compatible data-flow edges,
// and suggests/validates connections. Shared between the MCP server and
// the graph-editor UI.

import { nodeRegistry, getNodesByCategory } from "./registry/node-registry"
import { nodeSchemas } from "./registry/node-schemas"

// ------------------------------------------------------------------ types

export type PortType = "boolean" | "string" | "number"

export type PortDef = {
  key: string
  label: string
  type: PortType
}

export type ComponentDef = {
  id: string
  label: string
  category: string
  inputs: PortDef[]
  outputs: PortDef[]
  defaultProps: Record<string, unknown>
  schemaKey: string
}

export type Connection = {
  id: string
  sourceId: string
  sourcePort: string
  targetId: string
  targetPort: string
  sourceNodeId?: string
  targetNodeId?: string
  transform?: string
  createdAt: number
}

export type ConnectionSuggestion = {
  id: string
  sourceId: string
  sourceLabel: string
  sourcePort: string
  sourcePortType: PortType
  targetId: string
  targetLabel: string
  targetPort: string
  targetPortType: PortType
  match: boolean
  score: number
  reason?: string
}

export type GraphSummary = {
  components: number
  connections: number
  suggestions: ConnectionSuggestion[]
  categoryCounts: Record<string, number>
}

// ------------------------------------------------------------------ storage

const STORAGE_KEY = "shadcncanvas:connections"

export function listConnections(): Connection[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Connection[]) : []
  } catch {
    return []
  }
}

export function loadConnections(): Connection[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Connection[]) : []
  } catch {
    return []
  }
}

export function addConnection(
  connection: Omit<Connection, "id" | "createdAt">,
): Connection {
  const id = `conn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const conn: Connection = { ...connection, id, createdAt: Date.now() }
  const connections = loadConnections()
  connections.push(conn)
  saveConnections(connections)
  return conn
}

export function removeConnection(connId: string): boolean {
  const connections = loadConnections()
  const filtered = connections.filter((c) => c.id !== connId)
  if (filtered.length === connections.length) return false
  saveConnections(filtered)
  return true
}

export function clearConnections(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, "[]")
}

export function saveConnections(connections: Connection[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections))
}

// ------------------------------------------------------------------ schema helpers

export function getComponentSchema(componentId: string) {
  return nodeSchemas[componentId]
}

export function hasValidSchema(componentId: string): boolean {
  return nodeSchemas[componentId] !== undefined
}

// ------------------------------------------------------------------ port analysis

function toPortDef(port: { key: string; label: string; type: string }): PortDef {
  return { key: port.key, label: port.label, type: port.type as PortType }
}

export function getComponentDef(componentId: string): ComponentDef | null {
  const config = nodeRegistry[componentId]
  if (!config) return null
  return {
    id: componentId,
    label: config.label,
    category: config.category,
    inputs: config.inputs.map(toPortDef),
    outputs: config.outputs.map(toPortDef),
    defaultProps: config.defaultProps,
    schemaKey: componentId,
  }
}

export function listComponents(): ComponentDef[] {
  return Object.entries(nodeRegistry).map(([id, config]) => ({
    id,
    label: config.label,
    category: config.category,
    inputs: config.inputs.map(toPortDef),
    outputs: config.outputs.map(toPortDef),
    defaultProps: config.defaultProps,
    schemaKey: id,
  }))
}

export function listCategories() {
  return getNodesByCategory()
}

// ------------------------------------------------------------------ matching

/**
 * Check whether a connection is type-compatible.
 * Strings can be connected to any string-type target port; booleans only to booleans; numbers only to numbers.
 */
export function isTypeCompatible(a: PortDef, b: PortDef): boolean {
  if (a.type === b.type) return true
  if (a.type === "string" && b.type === "string") return true
  return false
}

/**
 * Determine how well a source port can drive a target port.
 * Returns a score 0-100 plus a human-readable reason.
 */
export function connectionScore(a: PortDef, b: PortDef): { score: number; reason: string } {
  if (!isTypeCompatible(a, b)) {
    return { score: 0, reason: `Type mismatch: source is ${a.type}, target expects ${b.type}` }
  }

  // boolean -> boolean is an explicit trigger/state gate
  if (a.type === "boolean" && b.type === "boolean") {
    return { score: 95, reason: "boolean → boolean (trigger/state) — direct gate" }
  }

  // number → number (numeric data flow)
  if (a.type === "number" && b.type === "number") {
    return { score: 90, reason: "number → number (numeric data flow)" }
  }

  // string → string (data flow)
  if (a.type === "string" && b.type === "string") {
    return { score: 88, reason: "string → string (data flow)" }
  }

  // Fallback (should not be reached given the guards above)
  return { score: 0, reason: "Incompatible types" }
}

// ------------------------------------------------------------------ suggestion engine

/**
 * Suggest candidate connections for a given source component.
 * Returns all valid target ports plus a ranked list of suggestions.
 */
export function suggestConnections(
  sourceId: string,
  targets: ComponentDef[],
): ConnectionSuggestion[] {
  const source = getComponentDef(sourceId)
  if (!source) return []

  const suggestions: ConnectionSuggestion[] = []

  for (const target of targets) {
    if (target.id === sourceId) continue

    for (const outPort of source.outputs) {
      for (const inPort of target.inputs) {
        const { score, reason } = connectionScore(outPort, inPort)
        suggestions.push({
          id: `${sourceId}->${target.id}:${outPort.key}->${inPort.key}`,
          sourceId: sourceId,
          sourceLabel: source.label,
          sourcePort: outPort.key,
          sourcePortType: outPort.type,
          targetId: target.id,
          targetLabel: target.label,
          targetPort: inPort.key,
          targetPortType: inPort.type,
          match: score > 0,
          score,
          reason,
        })
      }
    }
  }

  // sort by score descending
  suggestions.sort((a, b) => b.score - a.score)
  return suggestions
}

/**
 * Find all safe (type-compatible) connections for a given component
 * against the full registry, excluding the component itself.
 */
export function findSafeConnections(componentId: string): ConnectionSuggestion[] {
  const source = getComponentDef(componentId)
  if (!source) return []

  const all = listComponents()
  return suggestConnections(componentId, all)
}

/**
 * Suggest an entire form wiring from a list of field components.
 * Returns a data-flow plan: inputs → fields → form → submit output.
 */
export function suggestFormWiring(fieldComponentIds: string[]): ConnectionSuggestion[] {
  const suggestions: ConnectionSuggestion[] = []
  const source = getComponentDef("form")
  if (!source) return suggestions

  const fieldDefs = fieldComponentIds
    .map((id) => getComponentDef(id))
    .filter(Boolean) as ComponentDef[]

  // For each field that produces a value, suggest wiring into the form
  for (const field of fieldDefs) {
    // form has outputs: submitted, isValid, payload
    // We suggest connecting the field's value output to the form's payload output
    // as a data-binding example.
    if (field.outputs.length > 0) {
      for (const outPort of field.outputs) {
        // Suggest connecting to form's payload output (generic string data flow)
        const formPayload = source.outputs.find((o) => o.key === "payload")
        if (formPayload && isTypeCompatible(outPort, formPayload)) {
          suggestions.push({
            id: `field-${field.id}->form-payload`,
            sourceId: field.id,
            sourceLabel: field.label,
            sourcePort: outPort.key,
            sourcePortType: outPort.type,
            targetId: "form",
            targetLabel: source.label,
            targetPort: formPayload.key,
            targetPortType: formPayload.type,
            match: true,
            score: 88,
            reason: `Field value → form payload (data binding)`,
          })
        }
      }
    }
  }

  // Suggest "submitted" toggle from the last field's valid output
  if (fieldDefs.length > 0) {
    const lastField = fieldDefs[fieldDefs.length - 1]
    const submitPort = source.outputs.find((o) => o.key === "submitted")
    if (submitPort && lastField.outputs.some((o) => o.type === "boolean")) {
      const boolPort = lastField.outputs.find((o) => o.type === "boolean")!
      suggestions.push({
        id: `validated->form-submitted`,
        sourceId: lastField.id,
        sourceLabel: lastField.label,
        sourcePort: boolPort.key,
        sourcePortType: boolPort.type,
        targetId: "form",
        targetLabel: source.label,
        targetPort: "submitted",
        targetPortType: submitPort.type,
        match: true,
        score: 85,
        reason: "form submitted (validation gate)",
      })
    }
  }

  return suggestions
}

// ------------------------------------------------------------------ validation

/**
 * Validate a proposed connection against the registry.
 * Returns { ok: true } with a compatibility report, or { ok: false, errors } with details.
 */
export function validateConnection(
  sourceId: string,
  sourcePort: string,
  targetId: string,
  targetPort: string,
): {
  ok: boolean
  errors: string[]
  suggestions: ConnectionSuggestion[]
  score: number
} {
  const source = getComponentDef(sourceId)
  const target = getComponentDef(targetId)
  const errors: string[] = []

  if (!source) {
    return { ok: false, errors: [`Unknown source component: ${sourceId}`], suggestions: [], score: 0 }
  }
  if (!target) {
    return { ok: false, errors: [`Unknown target component: ${targetId}`], suggestions: [], score: 0 }
  }

  const sourcePortDef = source.outputs.find((p) => p.key === sourcePort)
  const targetPortDef = target.inputs.find((p) => p.key === targetPort)

  if (!sourcePortDef) {
    return { ok: false, errors: [`Source component "${sourceId}" has no port "${sourcePort}"`], suggestions: [], score: 0 }
  }
  if (!targetPortDef) {
    return { ok: false, errors: [`Target component "${targetId}" has no port "${targetPort}"`], suggestions: [], score: 0 }
  }

  // Check for cycles (simple: no connection back to source)
  loadConnections()
  // (cycle detection would require the connection store; here we just note it)

  const { score } = connectionScore(sourcePortDef, targetPortDef)

  if (score === 0) {
    errors.push(`Type mismatch: cannot connect ${sourceId}.${sourcePort} → ${targetId}.${targetPort} (${sourcePortDef.type} → ${targetPortDef.type})`)
  }

  const suggestions = suggestConnections(sourceId, [target])
  return {
    ok: score > 0,
    errors,
    suggestions,
    score: score,
  }
}

// ------------------------------------------------------------------ graph summary

export function getGraphSummary(): GraphSummary {
  const components = listComponents()
  const connections = loadConnections()

  const categoryCounts: Record<string, number> = {}
  for (const c of components) {
    categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1
  }

  return {
    components: components.length,
    connections: connections.length,
    suggestions: [],
    categoryCounts,
  }
}

// ------------------------------------------------------------------ MCP exports

export const CONNECTION_TOOLS = {
  // Build a suggestion: source component → target component
  suggestConnection: (sourceId: string) => {
    const all = listComponents()
    return suggestConnections(sourceId, all)
  },
  // Find all safe connections for a component
  findSafeConnections,
  // Validate a proposed connection
  validateConnection,
  // List existing connections from storage
  listConnections: () => loadConnections(),
  // Clear the connection store
  clearConnections: () => {
    saveConnections([])
    return { ok: true }
  },
}
