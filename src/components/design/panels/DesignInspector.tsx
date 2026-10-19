import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  BringToFront,
  Copy,
  SendToBack,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DesignNode, DesignTextStyle, ShadowStyle } from "@/types/document";
import { useDocumentStore } from "@/store/document-store"

/**
 * Right sidebar for Design mode. Edits properties of the selected layer:
 * position/size, rotation, corner radius, fill, stroke, shadow, opacity,
 * and text-specific properties (content, size, weight, spacing, alignment).
 * Also provides z-order controls and duplicate/delete actions.
 */;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-hairline px-3 py-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-4 text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? Math.round(value * 100) / 100 : 0}
        onChange={(event) => {
          const next = parseFloat(event.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
        className="h-7 w-full min-w-0 rounded-md border border-hairline bg-card px-2 text-xs outline-none focus:border-primary"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const safe = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  return (
    <label className="flex items-center gap-2">
      <span className="w-4 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span
        className="size-7 shrink-0 rounded-md border border-hairline"
        style={{ background: value }}
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-full min-w-0 rounded-md border border-hairline bg-card px-2 text-xs outline-none focus:border-primary"
      />
      <input
        type="color"
        value={safe}
        onChange={(event) => onChange(event.target.value)}
        className="size-7 shrink-0 cursor-pointer rounded-md border border-hairline bg-card"
        aria-label={`${label} color picker`}
      />
    </label>
  );
}

export function DesignInspector() {
  const selection = useDocumentStore((s) => s.selection);
  const nodes = useDocumentStore((s) => s.nodes);
  const updateNode = useDocumentStore((s) => s.updateNode);
  const updateNodeStyle = useDocumentStore((s) => s.updateNodeStyle);
  const updateNodeText = useDocumentStore((s) => s.updateNodeText);
  const setNodeRect = useDocumentStore((s) => s.setNodeRect);
  const reorder = useDocumentStore((s) => s.reorder);
  const duplicateSelection = useDocumentStore((s) => s.duplicateSelection);
  const deleteNodes = useDocumentStore((s) => s.deleteNodes);

  if (selection.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="text-xs text-muted-foreground">
          Select a layer to edit its properties.
        </p>
      </div>
    );
  }

  if (selection.length > 1) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-hairline px-3 py-3">
          <p className="text-sm font-medium">{selection.length} layers selected</p>
        </div>
        <div className="flex gap-2 px-3 py-3">
          <ActionButton icon={<Copy className="size-3.5" />} label="Duplicate" onClick={duplicateSelection} />
          <ActionButton
            icon={<Trash2 className="size-3.5" />}
            label="Delete"
            onClick={() => deleteNodes(selection)}
          />
        </div>
      </div>
    );
  }

  const node: DesignNode | undefined = nodes[selection[0]];
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="text-xs text-muted-foreground">Layer not found.</p>
      </div>
    );
  }

  const style = node.style;
  const isText = node.type === "text" && node.text;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <span className="truncate text-sm font-medium">{node.name}</span>
        <div className="flex items-center gap-0.5">
          <IconButton
            label="Send to back"
            onClick={() => reorder(node.id, "back")}
            icon={<SendToBack className="size-3.5" />}
          />
          <IconButton
            label="Send backward"
            onClick={() => reorder(node.id, "backward")}
            icon={<ArrowDown className="size-3.5" />}
          />
          <IconButton
            label="Bring forward"
            onClick={() => reorder(node.id, "forward")}
            icon={<ArrowUp className="size-3.5" />}
          />
          <IconButton
            label="Bring to front"
            onClick={() => reorder(node.id, "front")}
            icon={<BringToFront className="size-3.5" />}
          />
        </div>
      </div>

      <Section title="Layout">
        <div className="flex gap-2">
          <NumberField
            label="X"
            value={node.x}
            onChange={(value) => updateNode(node.id, { x: value })}
          />
          <NumberField
            label="Y"
            value={node.y}
            onChange={(value) => updateNode(node.id, { y: value })}
          />
        </div>
        <div className="flex gap-2">
          <NumberField
            label="W"
            value={node.width}
            onChange={(value) =>
              setNodeRect(node.id, {
                x: node.x,
                y: node.y,
                width: Math.max(1, value),
                height: node.height,
              })
            }
          />
          <NumberField
            label="H"
            value={node.height}
            onChange={(value) =>
              setNodeRect(node.id, {
                x: node.x,
                y: node.y,
                width: node.width,
                height: Math.max(1, value),
              })
            }
          />
        </div>
        <div className="flex gap-2">
          <NumberField
            label="R"
            value={node.rotation}
            onChange={(value) => updateNode(node.id, { rotation: value })}
          />
          <NumberField
            label="Ø"
            value={style.radius}
            onChange={(value) => updateNodeStyle(node.id, { radius: value })}
          />
        </div>
      </Section>

      {!isText && (
        <Section title="Appearance">
          <ColorField
            label="F"
            value={style.fills[0] ?? "#ffffff"}
            onChange={(value) =>
              updateNodeStyle(node.id, { fills: [value, ...style.fills.slice(1)] })
            }
          />
          <NumberField
            label="S"
            value={style.strokeWidth}
            onChange={(value) =>
              updateNodeStyle(node.id, { strokeWidth: Math.max(0, value) })
            }
          />
          <ColorField
            label="SC"
            value={style.strokeColor ?? "#000000"}
            onChange={(value) => updateNodeStyle(node.id, { strokeColor: value })}
          />
          <label className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">Sh</span>
            <select
              value={style.shadow}
              onChange={(event) =>
                updateNodeStyle(node.id, {
                  shadow: event.target.value as ShadowStyle,
                })
              }
              className="h-7 w-full min-w-0 rounded-md border border-hairline bg-card px-2 text-xs outline-none focus:border-primary"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">O</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={style.opacity}
              onChange={(event) =>
                updateNodeStyle(node.id, { opacity: parseFloat(event.target.value) })
              }
              className="w-full"
            />
            <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
              {Math.round(style.opacity * 100)}%
            </span>
          </label>
        </Section>
      )}

      {isText && node.text && (
        <Section title="Text">
          <textarea
            value={node.text.content}
            onChange={(event) =>
              updateNodeText(node.id, { content: event.target.value })
            }
            rows={3}
            className="w-full resize-none rounded-md border border-hairline bg-card px-2 py-1.5 text-xs outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <NumberField
              label="S"
              value={node.text.fontSize}
              onChange={(value) =>
                updateNodeText(node.id, { fontSize: Math.max(1, value) })
              }
            />
            <NumberField
              label="W"
              value={node.text.fontWeight}
              step={100}
              onChange={(value) => updateNodeText(node.id, { fontWeight: value })}
            />
          </div>
          <div className="flex gap-2">
            <NumberField
              label="LH"
              value={node.text.lineHeight}
              step={0.1}
              onChange={(value) => updateNodeText(node.id, { lineHeight: value })}
            />
            <NumberField
              label="LS"
              value={node.text.letterSpacing}
              step={0.1}
              onChange={(value) =>
                updateNodeText(node.id, { letterSpacing: value })
              }
            />
          </div>
          <label className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">A</span>
            <select
              value={node.text.align}
              onChange={(event) =>
                updateNodeText(node.id, {
                  align: event.target.value as DesignTextStyle["align"],
                })
              }
              className="h-7 w-full min-w-0 rounded-md border border-hairline bg-card px-2 text-xs outline-none focus:border-primary"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <ColorField
            label="C"
            value={node.text.color}
            onChange={(value) => updateNodeText(node.id, { color: value })}
          />
        </Section>
      )}

      <div className="flex gap-2 px-3 py-3">
        <ActionButton
          icon={<Copy className="size-3.5" />}
          label="Duplicate"
          onClick={duplicateSelection}
        />
        <ActionButton
          icon={<Trash2 className="size-3.5" />}
          label="Delete"
          onClick={() => deleteNodes([node.id])}
        />
      </div>
    </div>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground"
    >
      {icon}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-card text-xs text-muted-foreground",
        "hover:bg-surface hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
