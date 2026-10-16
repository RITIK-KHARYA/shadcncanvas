export function formatJsxProp(key: string, value: unknown): string {
  if (key === "options" || key === "fields") return ""
  if (typeof value === "string") {
    return `${key}="${value.replace(/"/g, '\\"')}"`
  }
  if (typeof value === "boolean") {
    return value ? key : `${key}={false}`
  }
  return `${key}={${JSON.stringify(value)}}`
}

export function buildPropsString(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(
      ([key, value]) =>
        value !== undefined && key !== "options" && key !== "fields",
    )
    .map(([key, value]) => formatJsxProp(key, value))
    .join(" ")
}

/**
 * Like buildPropsString, but props present in `overrides` are emitted as
 * dynamic expressions (`key={expr}`) instead of their literal default.
 */
export function buildPropsStringWithOverrides(
  props: Record<string, unknown>,
  overrides: Map<string, string>,
): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || key === "options" || key === "fields") continue
    const expr = overrides.get(key)
    parts.push(expr !== undefined ? `${key}={${expr}}` : formatJsxProp(key, value))
  }
  for (const [key, expr] of overrides.entries()) {
    if (!(key in props)) parts.push(`${key}={${expr}}`)
  }
  return parts.join(" ")
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Indents every non-empty line of `code` by `spaces` spaces. */
export function indent(code: string, spaces: number): string {
  const pad = " ".repeat(spaces)
  return code
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n")
}

export function deriveStateName(
  componentType: string,
  nodeId: string,
  index: number,
  names: Map<string, string>,
): string {
  const userName = names.get(nodeId) || ""
  const base = userName || componentType || "node"
  const safeBase = base.replace(/[^a-zA-Z0-9]/g, "") || "node"
  const suffix = index > 1 ? `_${index}` : ""
  return `${safeBase}${suffix}`
}
