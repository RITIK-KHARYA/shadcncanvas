import type { DesignDocument, DesignNode } from "@/types/document"
import { absoluteRect } from "@/lib/document/geometry"
import { SHADOW_CSS as SHADOW } from "@/lib/document/style"

/**
 * Generates a self-contained React component from a design document.
 * Output uses inline styles (not Tailwind) so the exported file has zero
 * dependencies beyond React. Nodes are positioned absolutely within a
 * bounds-offset root container.
 */

type Entry = [string, string | number | undefined]

function styleLiteral(entries: Entry[]): string {
  const parts = entries
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "number" ? v : JSON.stringify(v)}`)
  return `{ ${parts.join(", ")} }`
}

function indent(text: string, level: number): string {
  const pad = "  ".repeat(level)
  return text
    .split("\n")
    .map((line) => (line.trim() === "" ? line : `${pad}${line}`))
    .join("\n")
}

function frameStyle(node: DesignNode, ox: number, oy: number): string {
  return styleLiteral([
    ["position", "absolute"],
    ["left", node.x - ox],
    ["top", node.y - oy],
    ["width", node.width],
    ["height", node.height],
    ["background", node.style.fills[0]],
    ["borderRadius", node.style.radius || undefined],
    [
      "border",
      node.style.strokeWidth > 0 && node.style.strokeColor
        ? `${node.style.strokeWidth}px solid ${node.style.strokeColor}`
        : undefined,
    ],
    ["boxShadow", SHADOW[node.style.shadow]],
    ["opacity", node.style.opacity !== 1 ? node.style.opacity : undefined],
    [
      "transform",
      node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    ],
    ["overflow", "hidden"],
    ["display", node.style.fills[0] ? undefined : "contents"],
  ])
}

function textStyle(node: DesignNode, ox: number, oy: number): string {
  const t = node.text
  return styleLiteral([
    ["position", "absolute"],
    ["left", node.x - ox],
    ["top", node.y - oy],
    ["width", node.width],
    ["color", t?.color],
    ["fontSize", t?.fontSize],
    ["fontWeight", t?.fontWeight],
    ["lineHeight", t?.lineHeight],
    ["letterSpacing", t?.letterSpacing || undefined],
    ["textAlign", t?.align],
    ["whiteSpace", "pre-wrap"],
    ["margin", 0],
    ["opacity", node.style.opacity !== 1 ? node.style.opacity : undefined],
    [
      "transform",
      node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    ],
  ])
}

function renderNode(
  doc: DesignDocument,
  node: DesignNode,
  ox: number,
  oy: number,
): string {
  if (node.type === "frame" || node.type === "group") {
    const children = node.childIds
      .map((id) => doc.nodes[id])
      .filter((c): c is DesignNode => Boolean(c))
      .map((child) => renderNode(doc, child, 0, 0))
      .join("\n")
    const style = frameStyle(node, ox, oy)
    return children
      ? `<div style={${style}}>\n${indent(children, 1)}\n</div>`
      : `<div style={${style}} />`
  }

  if (node.type === "text") {
    const content = node.text?.content ?? ""
    return `<p style={${textStyle(node, ox, oy)}}>{${JSON.stringify(content)}}</p>`
  }

  if (node.type === "image") {
    const style = styleLiteral([
      ["position", "absolute"],
      ["left", node.x - ox],
      ["top", node.y - oy],
      ["width", node.width],
      ["height", node.height],
      ["objectFit", "cover"],
      ["borderRadius", node.style.radius || undefined],
      ["opacity", node.style.opacity !== 1 ? node.style.opacity : undefined],
      [
        "transform",
        node.rotation ? `rotate(${node.rotation}deg)` : undefined,
      ],
    ])
    return `<img src={${JSON.stringify(node.image ?? "")}} alt="" style={${style}} />`
  }

  const rounded =
    node.type === "ellipse" ? 9999 : node.style.radius || undefined
  const style = styleLiteral([
    ["position", "absolute"],
    ["left", node.x - ox],
    ["top", node.y - oy],
    ["width", node.width],
    ["height", node.height],
    ["background", node.style.fills[0]],
    ["borderRadius", rounded],
    [
      "border",
      node.style.strokeWidth > 0 && node.style.strokeColor
        ? `${node.style.strokeWidth}px solid ${node.style.strokeColor}`
        : undefined,
    ],
    ["boxShadow", SHADOW[node.style.shadow]],
    ["opacity", node.style.opacity !== 1 ? node.style.opacity : undefined],
    [
      "transform",
      node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    ],
  ])
  return `<div style={${style}} />`
}

export function generateDesignCode(doc: DesignDocument): string {
  const page = doc.pages.find((p) => p.id === doc.currentPageId)
  if (!page || page.rootIds.length === 0) return ""

  const roots = page.rootIds
    .map((id) => doc.nodes[id])
    .filter((n): n is DesignNode => Boolean(n))
  if (roots.length === 0) return ""

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const node of Object.values(doc.nodes)) {
    const rect = absoluteRect(doc, node)
    minX = Math.min(minX, rect.x)
    minY = Math.min(minY, rect.y)
    maxX = Math.max(maxX, rect.x + rect.width)
    maxY = Math.max(maxY, rect.y + rect.height)
  }

  const width = Math.max(1, Math.round(maxX - minX))
  const height = Math.max(1, Math.round(maxY - minY))

  const body = roots.map((node) => renderNode(doc, node, minX, minY)).join("\n")
  const rootStyle = styleLiteral([
    ["position", "relative"],
    ["width", width],
    ["height", height],
    ["background", "#ffffff"],
  ])

  return [
    "export function Design() {",
    "  return (",
    `    <div style={${rootStyle}}>`,
    indent(body, 3),
    "    </div>",
    "  )",
    "}",
  ].join("\n")
}

export function downloadDesignCode(code: string, fileName = "Design.tsx") {
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
