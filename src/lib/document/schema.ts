import { z } from "zod"

import type {
  DesignDocument,
  DesignNode,
  DesignNodeType,
  DesignPage,
  DesignTextStyle,
} from "@/types/document"

/**
 * Zod schema for a persisted design document. The shape is stored as a plain
 * record of nodes keyed by ID (mirrors how Figma serializes its object tree),
 * so we validate each node individually rather than relying on TS types alone.
 */

const nodeTypes = [
  "frame",
  "rect",
  "ellipse",
  "line",
  "text",
  "image",
  "group",
] as const

const styleSchema = z.object({
  fills: z.array(z.string()),
  strokeColor: z.string().nullable(),
  strokeWidth: z.number(),
  radius: z.number(),
  opacity: z.number(),
  shadow: z.enum(["none", "sm", "md", "lg"]),
})

const textSchema = z.object({
  content: z.string(),
  fontFamily: z.string(),
  fontSize: z.number(),
  fontWeight: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  align: z.enum(["left", "center", "right"]),
  color: z.string(),
})

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(nodeTypes),
  name: z.string(),
  parentId: z.string().nullable(),
  childIds: z.array(z.string()),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  visible: z.boolean(),
  locked: z.boolean(),
  style: styleSchema,
  text: textSchema.optional(),
  image: z.string().optional(),
})

const pageSchema = z.object({
  id: z.string(),
  name: z.string(),
  rootIds: z.array(z.string()),
})

export const documentSchema = z.object({
  version: z.literal(1),
  pages: z.array(pageSchema),
  currentPageId: z.string(),
  nodes: z.record(z.string(), nodeSchema),
})

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

const DEFAULTS: Record<
  DesignNodeType,
  { width: number; height: number; name: string; fills: string[]; radius: number }
> = {
  frame: { width: 360, height: 260, name: "Frame", fills: ["#ffffff"], radius: 0 },
  rect: { width: 140, height: 140, name: "Rectangle", fills: ["#e5e7eb"], radius: 8 },
  ellipse: { width: 140, height: 140, name: "Ellipse", fills: ["#e5e7eb"], radius: 9999 },
  line: { width: 180, height: 0, name: "Line", fills: ["#111827"], radius: 0 },
  text: { width: 180, height: 26, name: "Text", fills: [], radius: 0 },
  image: { width: 220, height: 150, name: "Image", fills: ["#f3f4f6"], radius: 6 },
  group: { width: 160, height: 160, name: "Group", fills: [], radius: 0 },
}

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150"><rect width="100%" height="100%" fill="#e5e7eb"/><path d="M0 110 L70 60 L120 100 L170 50 L220 100 L220 150 L0 150 Z" fill="#9ca3af"/><circle cx="60" cy="45" r="18" fill="#d1d5db"/></svg>',
  )

function defaultText(): DesignTextStyle {
  return {
    content: "Text",
    fontFamily: "inherit",
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 1.3,
    letterSpacing: 0,
    align: "left",
    color: "#111827",
  }
}

export function createNodeOfType(
  type: DesignNodeType,
  rect: { x: number; y: number; width: number; height: number },
): DesignNode {
  const base = DEFAULTS[type]
  const node: DesignNode = {
    id: createId(type === "ellipse" ? "ellipse" : type),
    type,
    name: base.name,
    parentId: null,
    childIds: [],
    x: rect.x,
    y: rect.y,
    width: type === "line" ? base.width : Math.max(1, rect.width),
    height: type === "line" ? 0 : Math.max(1, rect.height),
    rotation: 0,
    visible: true,
    locked: false,
    style: {
      fills: base.fills,
      strokeColor: type === "frame" ? "#e5e7eb" : null,
      strokeWidth: type === "frame" ? 1 : 0,
      radius: base.radius,
      opacity: 1,
      shadow: "none",
    },
  }

  if (type === "text") node.text = defaultText()
  if (type === "image") node.image = PLACEHOLDER_IMAGE

  return node
}

export function createEmptyDocument(): DesignDocument {
  const pageId = createId("page")
  return {
    version: 1,
    pages: [{ id: pageId, name: "Page 1", rootIds: [] }],
    currentPageId: pageId,
    nodes: {},
  }
}

export function createPage(name: string): DesignPage {
  return { id: createId("page"), name, rootIds: [] }
}

export function parseDocument(value: unknown): DesignDocument | null {
  const result = documentSchema.safeParse(value)
  return result.success ? (result.data as DesignDocument) : null
}
