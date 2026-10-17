import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { NodePreview } from "@/components/canvas/NodeTypes/NodePreview";
import { Input } from "@/components/ui/input";
import { setComponentDragData } from "@/lib/dnd";
import {
  categoryLabels,
  getNodesByCategory,
  type NodeConfig,
} from "@/lib/registry";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "components", label: "Components" },
  { id: "loader", label: "Loader" },
] as const;

type LibraryMode = (typeof MODES)[number]["id"];

const LOADER_CATEGORY = "loading";

function useDragStartFor(type: string) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    setComponentDragData(event.dataTransfer, type);
  };
}

function DraggableComponentItem({ config }: { config: NodeConfig }) {
  const onDragStart = useDragStartFor(config.type);

  return (
    <div
      role="listitem"
      draggable
      onDragStart={onDragStart}
      className="flex h-8 cursor-grab items-center rounded-lg px-2.5 text-sm text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground active:cursor-grabbing"
    >
      {config.label}
    </div>
  );
}

function DraggableLoaderItem({ config }: { config: NodeConfig }) {
  const onDragStart = useDragStartFor(config.type);

  return (
    <div
      role="listitem"
      draggable
      onDragStart={onDragStart}
      className="group cursor-grab select-none rounded-xl border border-hairline/60 bg-card/60 p-3 transition-colors hover:border-primary/40 hover:bg-card active:cursor-grabbing"
    >
      <div className="flex h-16 items-center justify-center overflow-hidden rounded-lg">
        <NodePreview
          componentType={config.type}
          props={config.defaultProps}
          state={{}}
          sizeMode="default"
        />
      </div>
      <p className="mt-2 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {config.label}
      </p>
    </div>
  );
}

function LoaderArea({ items }: { items: NodeConfig[] }) {
  return (
    <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-2 pb-2 pt-3">
      <h2 className="mb-1.5 px-1 text-[11px] font-medium text-muted-foreground">
        Loading
      </h2>
      <div className="grid gap-1.5">
        {items.map((config) => (
          <DraggableLoaderItem key={config.type} config={config} />
        ))}
      </div>
      <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">
        Drag a loader onto the canvas to preview its animation.
      </p>
    </div>
  );
}

export function ComponentLibrary() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<LibraryMode>("components");
  const groups = useMemo(() => getNodesByCategory(), []);

  const normalizedQuery = query.trim().toLowerCase();
  const loaderItems = groups.get(LOADER_CATEGORY) ?? [];
  const componentGroups = Array.from(groups.entries()).filter(
    ([category]) => category !== LOADER_CATEGORY,
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="px-3 pt-2">
        <div role="tablist" aria-label="Library mode" className="flex gap-1">
          {MODES.map((entry) => {
            const active = mode === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(entry.id)}
                className={cn(
                  "relative px-2 pb-2 pt-1 text-[13px] transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {entry.label}
                {active && (
                  <motion.span
                    layoutId="library-tab-underline"
                    className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "components" ? (
        <>
          <div className="px-3 pb-1 pt-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                aria-label="Search components"
                placeholder="Search components"
                className="h-8 border-transparent bg-surface pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-2 pb-2 pt-1">
            {componentGroups.map(([category, items]) => {
              const filtered = items.filter(
                (item) =>
                  !normalizedQuery ||
                  item.label.toLowerCase().includes(normalizedQuery) ||
                  item.type.toLowerCase().includes(normalizedQuery),
              );

              if (filtered.length === 0) return null;

              return (
                <section key={category} className="mb-4">
                  <h2 className="mb-1.5 px-1 text-[11px] font-medium text-muted-foreground">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid gap-0.5">
                    {filtered.map((config) => (
                      <DraggableComponentItem key={config.type} config={config} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <LoaderArea items={loaderItems} />
      )}
    </div>
  );
}
