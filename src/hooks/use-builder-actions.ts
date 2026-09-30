import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { signOut } from "@/lib/auth-client"
import { generateFullCode, generateNodeCode } from "@/lib/codegen"
import { exportProjectZip } from "@/lib/exportZip"
import { useGraphStore } from "@/store/graph-store"
import type { ThemeTokens } from "@/store/theme-store"

const LOGOUT_REDIRECT = "/auth"

export type BuilderActions = {
  hasCanvasContent: boolean
  onClearCanvas: () => void
  onCopyCode: () => void
  onExportZip: () => void
  onLogout: () => void
}

/**
 * The builder toolbar's side effects: clearing the canvas, copying generated
 * code, exporting a ZIP, and signing out. Each one owns its own validation,
 * async work and user-facing toast, so the page only wires up buttons.
 */
export function useBuilderActions({
  projectName,
  tokens,
}: {
  projectName: string
  tokens: ThemeTokens
}): BuilderActions {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId)
  const clearCanvas = useGraphStore((s) => s.clearCanvas)

  const hasCanvasContent = nodes.length > 0 || edges.length > 0

  // `?? null` matters: a selected id can outlive its node (e.g. after an undo),
  // and in that case we must fall back to exporting the whole graph.
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const onClearCanvas = useCallback(() => {
    if (!hasCanvasContent) return

    clearCanvas()
    toast.success("Canvas cleared")
  }, [clearCanvas, hasCanvasContent])

  const onCopyCode = useCallback(async () => {
    const code = selectedNode
      ? generateNodeCode(selectedNode)
      : generateFullCode(nodes, edges, tokens)

    if (!code.trim()) {
      toast.error("Nothing to copy — add nodes to the canvas first")
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      toast.success(
        selectedNode
          ? "Node code copied to clipboard"
          : "Full code copied to clipboard",
      )
    } catch (err) {
      console.error("Copy failed:", err)
      toast.error("Failed to copy — check browser permissions")
    }
  }, [edges, nodes, selectedNode, tokens])

  const onExportZip = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error("Nothing to export — add nodes to the canvas first")
      return
    }

    try {
      await exportProjectZip({ nodes, edges, theme: tokens, projectName })
      toast.success("ZIP exported")
    } catch (err) {
      console.error("Export failed:", err)
      toast.error("Export failed")
    }
  }, [edges, nodes, projectName, tokens])

  const onLogout = useCallback(async () => {
    try {
      await signOut({ callbackURL: LOGOUT_REDIRECT })
      toast.success("Logged out successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to log out")
    }
  }, [])

  return { hasCanvasContent, onClearCanvas, onCopyCode, onExportZip, onLogout }
}
