import { useEffect, useState } from "react"
import { Copy, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { nodeRegistry } from "@/lib/registry"
import { useGraphStore } from "@/store/graph-store"
import type { CanvasNode } from "@/types/graph"

export function SidebarHeader({
  node,
  selectedCount,
}: {
  node: CanvasNode | null
  selectedCount: number
}) {
  const renameNode = useGraphStore((s) => s.renameNode)
  const duplicateNode = useGraphStore((s) => s.duplicateNode)
  const deleteNode = useGraphStore((s) => s.deleteNode)

  const config = node ? nodeRegistry[node.data.componentType] : null
  const [name, setName] = useState(node?.data.name ?? config?.label ?? "")

  useEffect(() => {
    setName(node?.data.name ?? config?.label ?? "")
  }, [node?.id, node?.data.name, config?.label])

  if (selectedCount > 1) {
    return (
      <div className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-[10px] font-medium text-primary">
          {selectedCount}
        </span>
        <p className="truncate text-xs font-medium">
          {selectedCount} layers selected
        </p>
      </div>
    )
  }

  if (!node || !config) {
    return (
      <div className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
        <span className="size-2 rounded-full bg-muted-foreground/30" aria-hidden="true" />
        <p className="truncate text-xs font-medium text-muted-foreground">
          No selection
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b px-3">
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-[10px] font-semibold text-primary"
        aria-hidden="true"
      >
        {config.label.slice(0, 1)}
      </span>
      <Input
        aria-label="Layer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => renameNode(node.id, name.trim() || config.label)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
        }}
        className="h-7 flex-1 border-transparent bg-transparent px-1.5 text-xs font-medium shadow-none hover:bg-accent/40 focus-visible:border-input focus-visible:bg-background"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="More actions"
          >
            <MoreHorizontal className="size-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => duplicateNode(node.id)}>
            <Copy aria-hidden="true" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => deleteNode(node.id)}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
