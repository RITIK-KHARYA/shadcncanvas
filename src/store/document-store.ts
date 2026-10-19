import { create } from "zustand"

/**
 * Central store for the design document. Wraps a zundo temporal store so every
 * mutation to nodes/pages is undoable. `partialize` captures only the document
 * graph (not transient UI state like selection or tool) for history entries.
 */
import { temporal } from "zundo"

import type {
  DesignDocument,
  DesignNode,
  DesignNodeStyle,
  DesignTextStyle,
} from "@/types/document"
import {
  createEmptyDocument,
  createId,
  createNodeOfType,
  createPage,
} from "@/lib/document/schema"

export type DesignTool =
  | "move"
  | "frame"
  | "rect"
  | "ellipse"
  | "line"
  | "text"
  | "image"
  | "hand"

type DocumentStore = {
  version: 1
  pages: DesignDocument["pages"]
  currentPageId: string
  nodes: Record<string, DesignNode>
  selection: string[]
  tool: DesignTool

  getDocument: () => DesignDocument
  replaceDocument: (doc: DesignDocument) => void

  setTool: (tool: DesignTool) => void
  setSelection: (ids: string[]) => void
  toggleSelection: (id: string) => void
  clearSelection: () => void

  insertNode: (node: DesignNode, parentId?: string | null) => void
  createShape: (
    type: DesignNode["type"],
    rect: { x: number; y: number; width: number; height: number },
    parentId?: string | null,
  ) => string
  updateNode: (id: string, patch: Partial<DesignNode>) => void
  updateNodeStyle: (id: string, patch: Partial<DesignNodeStyle>) => void
  updateNodeText: (id: string, patch: Partial<DesignTextStyle>) => void
  moveNodes: (ids: string[], dx: number, dy: number) => void
  setNodeRect: (
    id: string,
    rect: { x: number; y: number; width: number; height: number },
  ) => void
  deleteNodes: (ids: string[]) => void
  duplicateSelection: () => void
  renameNode: (id: string, name: string) => void
  toggleVisible: (id: string) => void
  toggleLocked: (id: string) => void
  reorder: (id: string, mode: "front" | "back" | "forward" | "backward") => void

  addPage: () => void
  setCurrentPage: (id: string) => void
  renamePage: (id: string, name: string) => void
}

function collectDescendants(
  nodes: Record<string, DesignNode>,
  id: string,
  acc: string[],
) {
  acc.push(id)
  const node = nodes[id]
  if (!node) return
  for (const childId of node.childIds) {
    collectDescendants(nodes, childId, acc)
  }
}

function childrenOf(
  state: {
    pages: DesignDocument["pages"]
    currentPageId: string
    nodes: Record<string, DesignNode>
  },
  parentId: string | null,
): string[] {
  if (parentId === null) {
    const page = state.pages.find((p) => p.id === state.currentPageId)
    return page ? page.rootIds : []
  }
  return state.nodes[parentId]?.childIds ?? []
}

export const useDocumentStore = create<DocumentStore>()(
  temporal(
    (set, get) => ({
      ...createEmptyDocument(),
      selection: [],
      tool: "move",

      getDocument: () => {
        const { version, pages, currentPageId, nodes } = get()
        return { version, pages, currentPageId, nodes }
      },

      replaceDocument: (doc) =>
        set({
          version: doc.version,
          pages: doc.pages,
          currentPageId: doc.currentPageId,
          nodes: doc.nodes,
          selection: [],
        }),

      setTool: (tool) => set({ tool }),
      setSelection: (ids) => set({ selection: ids }),
      toggleSelection: (id) =>
        set((state) => ({
          selection: state.selection.includes(id)
            ? state.selection.filter((s) => s !== id)
            : [...state.selection, id],
        })),
      clearSelection: () => set({ selection: [] }),

      insertNode: (node, parentId = null) =>
        set((state) => {
          const withParent: DesignNode = { ...node, parentId }
          const nodes = { ...state.nodes, [node.id]: withParent }
          if (parentId === null) {
            return {
              nodes,
              pages: state.pages.map((p) =>
                p.id === state.currentPageId
                  ? { ...p, rootIds: [...p.rootIds, node.id] }
                  : p,
              ),
            }
          }
          const parent = nodes[parentId]
          if (parent) {
            nodes[parentId] = {
              ...parent,
              childIds: [...parent.childIds, node.id],
            }
          }
          return { nodes }
        }),

      createShape: (type, rect, parentId = null) => {
        const node = createNodeOfType(type, rect)
        get().insertNode(node, parentId)
        set({ selection: [node.id] })
        return node.id
      },

      updateNode: (id, patch) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          return { nodes: { ...state.nodes, [id]: { ...node, ...patch } } }
        }),

      updateNodeStyle: (id, patch) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, style: { ...node.style, ...patch } },
            },
          }
        }),

      updateNodeText: (id, patch) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          const text: DesignTextStyle = {
            ...(node.text ?? {
              content: "",
              fontFamily: "inherit",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: 0,
              align: "left",
              color: "#111827",
            }),
            ...patch,
          }
          return { nodes: { ...state.nodes, [id]: { ...node, text } } }
        }),

      moveNodes: (ids, dx, dy) =>
        set((state) => {
          const nodes = { ...state.nodes }
          for (const id of ids) {
            const node = nodes[id]
            if (!node || node.locked) continue
            nodes[id] = { ...node, x: node.x + dx, y: node.y + dy }
          }
          return { nodes }
        }),

      setNodeRect: (id, rect) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          return { nodes: { ...state.nodes, [id]: { ...node, ...rect } } }
        }),

      deleteNodes: (ids) =>
        set((state) => {
          const doomed = new Set<string>()
          for (const id of ids) {
            const acc: string[] = []
            collectDescendants(state.nodes, id, acc)
            acc.forEach((n) => doomed.add(n))
          }
          const nodes = { ...state.nodes }
          doomed.forEach((id) => delete nodes[id])
          return {
            nodes,
            pages: state.pages.map((p) => ({
              ...p,
              rootIds: p.rootIds.filter((id) => !doomed.has(id)),
            })),
            selection: [],
          }
        }),

      duplicateSelection: () =>
        set((state) => {
          const nodes = { ...state.nodes }
          const newSelection: string[] = []

          const clone = (id: string, parentId: string | null): string | null => {
            const source = state.nodes[id]
            if (!source) return null
            const newId = createId(source.type)
            const childIds: string[] = []
            for (const childId of source.childIds) {
              const clonedChild = clone(childId, newId)
              if (clonedChild) childIds.push(clonedChild)
            }
            nodes[newId] = {
              ...source,
              id: newId,
              parentId,
              childIds,
              x: parentId === null ? source.x + 24 : source.x,
              y: parentId === null ? source.y + 24 : source.y,
            }
            return newId
          }

          for (const id of state.selection) {
            const source = state.nodes[id]
            if (!source) continue
            const newId = clone(id, source.parentId)
            if (!newId) continue
            newSelection.push(newId)
            if (source.parentId && nodes[source.parentId]) {
              const parent = nodes[source.parentId]
              nodes[source.parentId] = {
                ...parent,
                childIds: [...parent.childIds, newId],
              }
            }
          }

          const pages = state.pages.map((p) =>
            p.id === state.currentPageId
              ? {
                  ...p,
                  rootIds: [
                    ...p.rootIds,
                    ...newSelection.filter(
                      (id) => nodes[id].parentId === null,
                    ),
                  ],
                }
              : p,
          )

          return { nodes, pages, selection: newSelection }
        }),

      renameNode: (id, name) => get().updateNode(id, { name }),

      toggleVisible: (id) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, visible: !node.visible },
            },
          }
        }),

      toggleLocked: (id) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          return {
            nodes: { ...state.nodes, [id]: { ...node, locked: !node.locked } },
          }
        }),

      reorder: (id, mode) =>
        set((state) => {
          const node = state.nodes[id]
          if (!node) return {}
          const parentId = node.parentId
          const siblings = [...childrenOf(state, parentId)]
          const index = siblings.indexOf(id)
          if (index === -1) return {}
          siblings.splice(index, 1)
          const target =
            mode === "front"
              ? siblings.length
              : mode === "back"
                ? 0
                : mode === "forward"
                  ? Math.min(siblings.length, index + 1)
                  : Math.max(0, index - 1)
          siblings.splice(target, 0, id)

          if (parentId === null) {
            return {
              pages: state.pages.map((p) =>
                p.id === state.currentPageId ? { ...p, rootIds: siblings } : p,
              ),
            }
          }
          const parent = state.nodes[parentId]
          if (!parent) return {}
          return {
            nodes: {
              ...state.nodes,
              [parentId]: { ...parent, childIds: siblings },
            },
          }
        }),

      addPage: () =>
        set((state) => {
          const page = createPage(`Page ${state.pages.length + 1}`)
          return {
            pages: [...state.pages, page],
            currentPageId: page.id,
            selection: [],
          }
        }),

      setCurrentPage: (id) => set({ currentPageId: id, selection: [] }),

      renamePage: (id, name) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
    }),
    {
      partialize: (state) => ({
        nodes: state.nodes,
        pages: state.pages,
        currentPageId: state.currentPageId,
      }),
      limit: 100,
    },
  ),
)
