import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Eye,
  EyeOff,
  Frame,
  Group,
  Image as ImageIcon,
  Lock,
  Minus,
  Plus,
  Square,
  Type,
  Unlock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DesignNode } from "@/types/document";
import { useDocumentStore } from "@/store/document-store"

/**
 * Left sidebar for Design mode. Shows the page list (with add/rename) and a
 * recursive layer tree for the current page. Supports inline rename
 * (double-click), visibility toggle, and lock toggle per layer.
 */;

const TYPE_ICON: Record<DesignNode["type"], typeof Square> = {
  frame: Frame,
  group: Group,
  rect: Square,
  ellipse: Circle,
  line: Minus,
  text: Type,
  image: ImageIcon,
};

function LayerRow({
  node,
  depth,
}: {
  node: DesignNode;
  depth: number;
}) {
  const selection = useDocumentStore((s) => s.selection);
  const nodes = useDocumentStore((s) => s.nodes);
  const setSelection = useDocumentStore((s) => s.setSelection);
  const toggleSelection = useDocumentStore((s) => s.toggleSelection);
  const toggleVisible = useDocumentStore((s) => s.toggleVisible);
  const toggleLocked = useDocumentStore((s) => s.toggleLocked);
  const renameNode = useDocumentStore((s) => s.renameNode);

  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(node.name);

  const selected = selection.includes(node.id);
  const Icon = TYPE_ICON[node.type];
  const hasChildren = node.childIds.length > 0;

  const commit = () => {
    renameNode(node.id, draft.trim() || node.name);
    setEditing(false);
  };

  return (
    <>
      <div
        className={cn(
          "group flex h-7 items-center gap-1 rounded-md pr-1 text-xs",
          selected ? "bg-primary/10 text-foreground" : "hover:bg-surface",
        )}
        style={{ paddingLeft: 4 + depth * 12 }}
        onClick={(event) => {
          if (event.shiftKey) toggleSelection(node.id);
          else setSelection([node.id]);
        }}
      >
        <button
          type="button"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center text-muted-foreground",
            !hasChildren && "invisible",
          )}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>

        <Icon className="size-3.5 shrink-0 text-muted-foreground" />

        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Enter") commit();
              if (event.key === "Escape") setEditing(false);
            }}
            className="h-5 min-w-0 flex-1 rounded border border-hairline bg-card px-1 text-xs outline-none focus:border-primary"
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              !node.visible && "text-muted-foreground line-through",
            )}
            onDoubleClick={(event) => {
              event.stopPropagation();
              setDraft(node.name);
              setEditing(true);
            }}
          >
            {node.name}
          </span>
        )}

        <button
          type="button"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground",
            node.locked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(event) => {
            event.stopPropagation();
            toggleLocked(node.id);
          }}
          aria-label={node.locked ? "Unlock" : "Lock"}
        >
          {node.locked ? (
            <Lock className="size-3.5" />
          ) : (
            <Unlock className="size-3.5" />
          )}
        </button>

        <button
          type="button"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground",
            node.visible ? "opacity-0 group-hover:opacity-100" : "opacity-100",
          )}
          onClick={(event) => {
            event.stopPropagation();
            toggleVisible(node.id);
          }}
          aria-label={node.visible ? "Hide" : "Show"}
        >
          {node.visible ? (
            <Eye className="size-3.5" />
          ) : (
            <EyeOff className="size-3.5" />
          )}
        </button>
      </div>

      {expanded &&
        hasChildren &&
        node.childIds.map((childId) =>
          nodes[childId] ? (
            <LayerRow key={childId} node={nodes[childId]} depth={depth + 1} />
          ) : null,
        )}
    </>
  );
}

export function LayersPanel() {
  const pages = useDocumentStore((s) => s.pages);
  const currentPageId = useDocumentStore((s) => s.currentPageId);
  const nodes = useDocumentStore((s) => s.nodes);
  const setCurrentPage = useDocumentStore((s) => s.setCurrentPage);
  const addPage = useDocumentStore((s) => s.addPage);
  const renamePage = useDocumentStore((s) => s.renamePage);

  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const page = pages.find((p) => p.id === currentPageId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Pages
        </span>
        <button
          type="button"
          onClick={addPage}
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground"
          aria-label="Add page"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-0.5 px-2 py-2">
        {pages.map((item) => {
          const active = item.id === currentPageId;
          return (
            <div
              key={item.id}
              className={cn(
                "flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 text-xs",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-surface",
              )}
              onClick={() => setCurrentPage(item.id)}
            >
              {editingPageId === item.id ? (
                <input
                  autoFocus
                  value={item.name}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    renamePage(item.id, event.target.value)
                  }
                  onBlur={() => setEditingPageId(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === "Escape")
                      setEditingPageId(null);
                  }}
                  className="h-5 min-w-0 flex-1 rounded border border-hairline bg-card px-1 text-xs outline-none focus:border-primary"
                />
              ) : (
                <span
                  className="min-w-0 flex-1 truncate"
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    setEditingPageId(item.id);
                  }}
                >
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-b border-t border-hairline px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Layers
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        {page && page.rootIds.length > 0 ? (
          [...page.rootIds].reverse().map((id) =>
            nodes[id] ? <LayerRow key={id} node={nodes[id]} depth={0} /> : null,
          )
        ) : (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No layers yet. Pick a tool and draw on the canvas.
          </p>
        )}
      </div>
    </div>
  );
}
