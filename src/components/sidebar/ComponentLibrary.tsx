import { Component, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { setComponentDragData } from "@/lib/dnd"
import {
  categoryLabels,
  getNodesByCategory,
  type NodeConfig,
} from "@/lib/nodeRegistry"

function DraggableComponentItem({ config }: { config: NodeConfig }) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setComponentDragData(event.dataTransfer, config.type)
  }

  return (
    <div
      role="listitem"
      draggable
      onDragStart={onDragStart}
      className="flex h-9 cursor-grab items-center gap-2 rounded-md border bg-background/60 px-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
    >
      <Component className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      {config.label}
    </div>
  )
}

export function ComponentLibrary() {
  const [query, setQuery] = useState("")
  const groups = useMemo(() => getNodesByCategory(), [])

  const normalizedQuery = query.trim().toLowerCase()

  return (
    <>
      <div className="border-b p-4">
        <h1 className="text-sm font-semibold">Components</h1>
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search components"
            placeholder="Search shadcn/ui"
            className="h-8 pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3" role="list">
        {Array.from(groups.entries()).map(([category, items]) => {
          const filtered = items.filter(
            (item) =>
              !normalizedQuery ||
              item.label.toLowerCase().includes(normalizedQuery) ||
              item.type.toLowerCase().includes(normalizedQuery),
          )

          if (filtered.length === 0) return null

          return (
            <section key={category} className="mb-5">
              <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {categoryLabels[category]}
              </h2>
              <div className="grid gap-1.5">
                {filtered.map((config) => (
                  <DraggableComponentItem key={config.type} config={config} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
