import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Selecto from "react-selecto";
import {
  Circle,
  Frame,
  Hand,
  Image as ImageIcon,
  Minus,
  MousePointer2,
  Square,
  Type,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SHADOW_CSS } from "@/lib/document/style";
import {
  absoluteRect,
  angleFromCenter,
  resizeNode,
  type ResizeDir,
  type Vec,
} from "@/lib/document/geometry";
import type { DesignNode } from "@/types/document";
import { useDocumentStore, type DesignTool } from "@/store/document-store";
import { useViewportStore } from "@/store/viewport-store";

/**
 * The Figma-style design canvas. Renders the document graph inside a
 * pan/zoom-transformed world layer, overlays a screen-space selection layer
 * with resize/rotate handles, and handles all pointer interactions:
 * - Move tool: click to select, drag to move, shift-click to multi-select
 * - Creation tools: drag to draw a new shape (click creates a default size)
 * - Hand tool / space+drag / middle-button: pan the viewport
 * - Mouse wheel: zoom centered on the cursor
 *
 * During gestures (drag/resize/rotate) the interaction is held in local React
 * state and only committed to the zustand store on pointer-up, so each gesture
 * produces exactly one undo history entry.
 */

type DragInteraction = {
  kind: "drag";
  ids: string[];
  startWorld: Vec;
  dx: number;
  dy: number;
};

type ResizeInteraction = {
  kind: "resize";
  id: string;
  dir: ResizeDir;
  node: DesignNode;
  startWorld: Vec;
  rect: { x: number; y: number; width: number; height: number };
};

type RotateInteraction = {
  kind: "rotate";
  id: string;
  centerWorld: Vec;
  startAngle: number;
  startRotation: number;
  rotation: number;
};

type CreateInteraction = {
  kind: "create";
  type: DesignNode["type"];
  startWorld: Vec;
  currentWorld: Vec;
};

type Interaction =
  | DragInteraction
  | ResizeInteraction
  | RotateInteraction
  | CreateInteraction
  | null;

type PanState = { startClient: Vec; startPan: Vec } | null;

const HANDLES: { dir: ResizeDir; className: string; cursor: string }[] = [
  { dir: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "nwse-resize" },
  { dir: "n", className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", cursor: "ns-resize" },
  { dir: "ne", className: "left-full top-0 -translate-x-1/2 -translate-y-1/2", cursor: "nesw-resize" },
  { dir: "e", className: "left-full top-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
  { dir: "se", className: "left-full top-full -translate-x-1/2 -translate-y-1/2", cursor: "nwse-resize" },
  { dir: "s", className: "left-1/2 top-full -translate-x-1/2 -translate-y-1/2", cursor: "ns-resize" },
  { dir: "sw", className: "left-0 top-full -translate-x-1/2 -translate-y-1/2", cursor: "nesw-resize" },
  { dir: "w", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2", cursor: "ew-resize" },
];

const TOOL_NODE_TYPE: Partial<Record<DesignTool, DesignNode["type"]>> = {
  frame: "frame",
  rect: "rect",
  ellipse: "ellipse",
  line: "line",
  text: "text",
  image: "image",
};

const DEFAULT_SIZE: Record<string, { width: number; height: number }> = {
  frame: { width: 360, height: 260 },
  rect: { width: 140, height: 140 },
  ellipse: { width: 140, height: 140 },
  line: { width: 180, height: 0 },
  text: { width: 180, height: 26 },
  image: { width: 220, height: 150 },
};

const TOOLS: { tool: DesignTool; label: string; icon: typeof MousePointer2; key: string }[] = [
  { tool: "move", label: "Move", icon: MousePointer2, key: "V" },
  { tool: "frame", label: "Frame", icon: Frame, key: "F" },
  { tool: "rect", label: "Rectangle", icon: Square, key: "R" },
  { tool: "ellipse", label: "Ellipse", icon: Circle, key: "O" },
  { tool: "line", label: "Line", icon: Minus, key: "L" },
  { tool: "text", label: "Text", icon: Type, key: "T" },
  { tool: "image", label: "Image", icon: ImageIcon, key: "I" },
  { tool: "hand", label: "Hand", icon: Hand, key: "H" },
];

function transformOf(rotation: number, translate?: string): string | undefined {
  const parts: string[] = [];
  if (translate) parts.push(translate);
  if (rotation) parts.push(`rotate(${rotation}deg)`);
  return parts.length ? parts.join(" ") : undefined;
}

function NodeView({
  doc,
  node,
  interaction,
  onPointerDown,
}: {
  doc: Record<string, DesignNode>;
  node: DesignNode;
  interaction: Interaction;
  onPointerDown: (
    event: ReactPointerEvent,
    node: DesignNode,
  ) => void;
}) {
  const s = node.style;
  const isLine = node.type === "line";
  const isText = node.type === "text";
  const isContainer = node.type === "frame" || node.type === "group";

  let left = node.x;
  let top = node.y;
  let width = node.width;
  let height = isLine ? Math.max(1, s.strokeWidth || 1) : node.height;
  let rotation = node.rotation;
  let translate: string | undefined;

  if (interaction) {
    if (interaction.kind === "drag" && interaction.ids.includes(node.id)) {
      translate = `translate(${interaction.dx}px, ${interaction.dy}px)`;
    } else if (interaction.kind === "resize" && interaction.id === node.id) {
      left = interaction.rect.x;
      top = interaction.rect.y;
      width = interaction.rect.width;
      height = interaction.rect.height;
    } else if (interaction.kind === "rotate" && interaction.id === node.id) {
      rotation = interaction.rotation;
    }
  }

  const style: CSSProperties = {
    position: "absolute",
    left,
    top,
    width,
    height,
    opacity: s.opacity,
    background: isText ? undefined : s.fills[0],
    borderRadius: node.type === "ellipse" ? 9999 : s.radius || undefined,
    border:
      s.strokeWidth > 0 && s.strokeColor
        ? `${s.strokeWidth}px solid ${s.strokeColor}`
        : undefined,
    boxShadow: SHADOW_CSS[s.shadow],
    visibility: node.visible ? undefined : "hidden",
    transform: transformOf(rotation, translate),
    overflow: isContainer ? "hidden" : undefined,
    cursor: node.locked ? "default" : "move",
  };

  if (isText && node.text) {
    style.color = node.text.color;
    style.fontSize = node.text.fontSize;
    style.fontWeight = node.text.fontWeight;
    style.lineHeight = node.text.lineHeight;
    style.letterSpacing = node.text.letterSpacing || undefined;
    style.textAlign = node.text.align;
    style.whiteSpace = "pre-wrap";
    style.display = "block";
  }

  return (
    <div
      className="dn"
      data-node-id={node.id}
      style={style}
      onPointerDown={(event) => onPointerDown(event, node)}
    >
      {node.type === "frame" && (
        <span className="pointer-events-none absolute -top-5 left-0 whitespace-nowrap text-[11px] text-muted-foreground">
          {node.name}
        </span>
      )}
      {isText ? node.text?.content : null}
      {isContainer &&
        node.childIds.map((childId) =>
          doc[childId] ? (
            <NodeView
              key={childId}
              doc={doc}
              node={doc[childId]}
              interaction={interaction}
              onPointerDown={onPointerDown}
            />
          ) : null,
        )}
    </div>
  );
}

export function DesignSurface() {
  const doc = useDocumentStore();
  const nodes = doc.nodes;
  const pages = doc.pages;
  const currentPageId = doc.currentPageId;
  const selection = doc.selection;
  const tool = doc.tool;

  const zoom = useViewportStore((s) => s.zoom);
  const panX = useViewportStore((s) => s.panX);
  const panY = useViewportStore((s) => s.panY);
  const setZoom = useViewportStore((s) => s.setZoom);
  const setPan = useViewportStore((s) => s.setPan);

  const [interaction, setInteraction] = useState<Interaction>(null);
  const [pan, setPanState] = useState<PanState>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const spaceRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const docRef = useRef(doc);
  docRef.current = doc;

  const page = useMemo(
    () => pages.find((p) => p.id === currentPageId),
    [pages, currentPageId],
  );

  const toWorld = useCallback(
    (clientX: number, clientY: number): Vec => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: (clientX - rect.left - panX) / zoom,
        y: (clientY - rect.top - panY) / zoom,
      };
    },
    [panX, panY, zoom],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const worldX = (px - panX) / zoom;
      const worldY = (py - panY) / zoom;
      const next = zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1);
      const clamped = Math.min(8, Math.max(0.05, next));
      setZoom(clamped);
      setPan(px - worldX * clamped, py - worldY * clamped);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [panX, panY, zoom, setZoom, setPan]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const store = useDocumentStore.getState();
      const temporal = useDocumentStore.temporal.getState();
      const selected = store.selection;
      const mod = event.metaKey || event.ctrlKey;

      if (event.code === "Space") {
        spaceRef.current = true;
        event.preventDefault();
        return;
      }

      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) temporal.redo();
        else temporal.undo();
        return;
      }
      if (mod && event.key.toLowerCase() === "y") {
        event.preventDefault();
        temporal.redo();
        return;
      }
      if (mod && event.key.toLowerCase() === "d") {
        event.preventDefault();
        store.duplicateSelection();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selected.length) {
          event.preventDefault();
          store.deleteNodes(selected);
        }
        return;
      }
      if (event.key === "Escape") {
        store.clearSelection();
        store.setTool("move");
        return;
      }
      if (event.key.startsWith("Arrow")) {
        if (!selected.length) return;
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        store.moveNodes(selected, dx, dy);
        return;
      }

      const keyTools: Record<string, DesignTool> = {
        v: "move",
        f: "frame",
        r: "rect",
        o: "ellipse",
        l: "line",
        t: "text",
        i: "image",
        h: "hand",
      };
      const next = keyTools[event.key.toLowerCase()];
      if (next && !mod) store.setTool(next);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") spaceRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const onNodePointerDown = useCallback(
    (event: ReactPointerEvent, node: DesignNode) => {
      if (event.button !== 0) return;
      if (tool !== "move" || spaceRef.current) return;
      if (node.locked) return;
      event.stopPropagation();

      const store = useDocumentStore.getState();
      if (event.shiftKey) {
        store.toggleSelection(node.id);
        return;
      }

      const ids = store.selection.includes(node.id)
        ? store.selection
        : [node.id];
      if (!store.selection.includes(node.id)) store.setSelection([node.id]);

      containerRef.current?.setPointerCapture(event.pointerId);
      setInteraction({
        kind: "drag",
        ids,
        startWorld: toWorld(event.clientX, event.clientY),
        dx: 0,
        dy: 0,
      });
    },
    [tool, toWorld],
  );

  const onContainerPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const isMiddle = event.button === 1;
      if (tool === "hand" || spaceRef.current || isMiddle) {
        el.setPointerCapture(event.pointerId);
        setPanState({
          startClient: { x: event.clientX, y: event.clientY },
          startPan: { x: panX, y: panY },
        });
        return;
      }
      if (tool !== "move") {
        const nodeType = TOOL_NODE_TYPE[tool];
        if (!nodeType) return;
        const world = toWorld(event.clientX, event.clientY);
        el.setPointerCapture(event.pointerId);
        setInteraction({
          kind: "create",
          type: nodeType,
          startWorld: world,
          currentWorld: world,
        });
        return;
      }
      if (!event.shiftKey) useDocumentStore.getState().clearSelection();
    },
    [tool, panX, panY, toWorld],
  );

  const onContainerPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (pan) {
        setPan(
          pan.startPan.x + (event.clientX - pan.startClient.x),
          pan.startPan.y + (event.clientY - pan.startClient.y),
        );
        return;
      }
      if (!interaction) return;
      const world = toWorld(event.clientX, event.clientY);

      if (interaction.kind === "drag") {
        setInteraction({
          ...interaction,
          dx: world.x - interaction.startWorld.x,
          dy: world.y - interaction.startWorld.y,
        });
      } else if (interaction.kind === "resize") {
        const rect = resizeNode(interaction.node, interaction.dir, {
          x: world.x - interaction.startWorld.x,
          y: world.y - interaction.startWorld.y,
        });
        setInteraction({ ...interaction, rect });
      } else if (interaction.kind === "rotate") {
        const angle = angleFromCenter(interaction.centerWorld, world);
        setInteraction({
          ...interaction,
          rotation: interaction.startRotation + (angle - interaction.startAngle),
        });
      } else if (interaction.kind === "create") {
        setInteraction({ ...interaction, currentWorld: world });
      }
    },
    [pan, interaction, toWorld],
  );

  const onContainerPointerUp = useCallback(() => {
    const store = useDocumentStore.getState();
    if (pan) {
      setPanState(null);
      return;
    }
    if (!interaction) return;

    if (interaction.kind === "drag") {
      if (interaction.dx !== 0 || interaction.dy !== 0) {
        store.moveNodes(interaction.ids, interaction.dx, interaction.dy);
      }
    } else if (interaction.kind === "resize") {
      store.setNodeRect(interaction.id, interaction.rect);
    } else if (interaction.kind === "rotate") {
      store.updateNode(interaction.id, {
        rotation: Math.round(interaction.rotation),
      });
    } else if (interaction.kind === "create") {
      const a = interaction.startWorld;
      const b = interaction.currentWorld;
      let rect = {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(b.x - a.x),
        height: Math.abs(b.y - a.y),
      };
      if (rect.width < 8 && rect.height < 8) {
        const size = DEFAULT_SIZE[interaction.type] ?? { width: 140, height: 140 };
        rect = { x: a.x, y: a.y, width: size.width, height: size.height };
      }
      store.createShape(interaction.type, rect, null);
      store.setTool("move");
    }

    setInteraction(null);
  }, [pan, interaction]);

  const startResize = useCallback(
    (event: ReactPointerEvent, dir: ResizeDir) => {
      event.stopPropagation();
      const store = useDocumentStore.getState();
      const id = store.selection[0];
      const node = id ? store.nodes[id] : null;
      if (!node) return;
      containerRef.current?.setPointerCapture(event.pointerId);
      setInteraction({
        kind: "resize",
        id: node.id,
        dir,
        node,
        startWorld: toWorld(event.clientX, event.clientY),
        rect: {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        },
      });
    },
    [toWorld],
  );

  const startRotate = useCallback(
    (event: ReactPointerEvent) => {
      event.stopPropagation();
      const store = useDocumentStore.getState();
      const id = store.selection[0];
      const node = id ? store.nodes[id] : null;
      if (!node) return;
      const abs = absoluteRect(store.getDocument(), node);
      const centerWorld = {
        x: abs.x + abs.width / 2,
        y: abs.y + abs.height / 2,
      };
      containerRef.current?.setPointerCapture(event.pointerId);
      setInteraction({
        kind: "rotate",
        id: node.id,
        centerWorld,
        startAngle: angleFromCenter(
          centerWorld,
          toWorld(event.clientX, event.clientY),
        ),
        startRotation: node.rotation,
        rotation: node.rotation,
      });
    },
    [toWorld],
  );

  const selectionBox = useMemo(() => {
    if (selection.length === 0) return null;
    const document = docRef.current.getDocument();
    const rects = selection
      .map((id) => document.nodes[id])
      .filter((n): n is DesignNode => Boolean(n))
      .map((node) => absoluteRect(document, node));
    if (rects.length === 0) return null;

    if (rects.length === 1) {
      const node = document.nodes[selection[0]]!;
      const abs = rects[0];
      return {
        absX: abs.x,
        absY: abs.y,
        width: abs.width,
        height: abs.height,
        rotation: node.rotation,
        single: true,
      };
    }

    const minX = Math.min(...rects.map((r) => r.x));
    const minY = Math.min(...rects.map((r) => r.y));
    const maxX = Math.max(...rects.map((r) => r.x + r.width));
    const maxY = Math.max(...rects.map((r) => r.y + r.height));
    return {
      absX: minX,
      absY: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      single: false,
    };
  }, [selection]);

  const draft = interaction?.kind === "create" ? interaction : null;

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        setContainerEl(el);
      }}
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#f1f1f3]",
        tool === "hand" || pan ? "cursor-grab" : "cursor-default",
        pan && "cursor-grabbing",
      )}
      onPointerDown={onContainerPointerDown}
      onPointerMove={onContainerPointerMove}
      onPointerUp={onContainerPointerUp}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
      >
        {page?.rootIds.map((id) =>
          nodes[id] ? (
            <NodeView
              key={id}
              doc={nodes}
              node={nodes[id]}
              interaction={interaction}
              onPointerDown={onNodePointerDown}
            />
          ) : null,
        )}

        {draft && (
          <div
            className="pointer-events-none absolute border border-primary bg-primary/10"
            style={{
              left: Math.min(draft.startWorld.x, draft.currentWorld.x),
              top: Math.min(draft.startWorld.y, draft.currentWorld.y),
              width: Math.abs(draft.currentWorld.x - draft.startWorld.x),
              height: Math.abs(draft.currentWorld.y - draft.startWorld.y),
            }}
          />
        )}
      </div>

      {selectionBox && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: selectionBox.absX * zoom + panX,
            top: selectionBox.absY * zoom + panY,
            width: selectionBox.width * zoom,
            height: selectionBox.height * zoom,
            transform: selectionBox.rotation
              ? `rotate(${selectionBox.rotation}deg)`
              : undefined,
          }}
        >
          <div className="absolute inset-0 border border-primary" />
          {selectionBox.single && (
            <>
              {HANDLES.map((handle) => (
                <div
                  key={handle.dir}
                  className="pointer-events-auto absolute size-2 border border-primary bg-white"
                  style={{ cursor: handle.cursor }}
                  data-handle={handle.dir}
                >
                  <div
                    className="absolute inset-0"
                    style={{ transform: "scale(4)" }}
                    onPointerDown={(event) => startResize(event, handle.dir)}
                  />
                </div>
              ))}
              <div
                className="pointer-events-auto absolute left-1/2 size-2 -translate-x-1/2 rounded-full border border-primary bg-white"
                style={{ top: -24, cursor: "grab" }}
                onPointerDown={startRotate}
              />
            </>
          )}
        </div>
      )}

      <Selecto
        container={containerEl ?? undefined}
        dragContainer={containerEl ?? undefined}
        selectableTargets={[".dn"]}
        selectFromInside={false}
        selectByClick={false}
        hitRate={0}
        toggleContinueSelect={["shift"]}
        onDragStart={(event) => {
          const target = event.inputEvent.target as HTMLElement | null;
          if (
            tool !== "move" ||
            spaceRef.current ||
            (target && target.closest(".dn"))
          ) {
            event.stop();
          }
        }}
        onSelect={(event) => {
          const ids = event.selected
            .map((el) => el.getAttribute("data-node-id"))
            .filter((id): id is string => Boolean(id));
          useDocumentStore.getState().setSelection(ids);
        }}
      />

      <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-hairline bg-card p-1 shadow-md">
        {TOOLS.map((item) => {
          const Icon = item.icon;
          const active = tool === item.tool;
          return (
            <button
              key={item.tool}
              type="button"
              title={`${item.label} (${item.key})`}
              aria-label={item.label}
              onClick={() => doc.setTool(item.tool)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="pointer-events-auto absolute bottom-4 right-4 flex items-center gap-1 rounded-xl border border-hairline bg-card px-2 py-1 text-xs text-muted-foreground shadow-md">
        <button
          type="button"
          className="px-1 hover:text-foreground"
          onClick={() => setZoom(zoom / 1.2)}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-10 text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="px-1 hover:text-foreground"
          onClick={() => setZoom(zoom * 1.2)}
          aria-label="Zoom in"
        >
          +
        </button>
        <span className="mx-1 h-4 w-px bg-hairline" />
        <button
          type="button"
          className="px-1 hover:text-foreground"
          onClick={() => {
            setZoom(1);
            setPan(0, 0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
