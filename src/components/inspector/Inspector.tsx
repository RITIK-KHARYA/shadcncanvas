import { useMemo } from "react"
import { MousePointerClick } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FormFieldsEditor, SelectOptionsEditor } from "@/components/inspector/FormFieldsEditor"
import { getFieldErrors } from "@/lib/nodeSchemas"
import { nodeRegistry } from "@/lib/nodeRegistry"
import { useGraphStore } from "@/store/graphStore"
import {
  MIN_NODE_HEIGHT,
  MIN_NODE_WIDTH,
} from "@/components/canvas/NodeTypes/BaseNode"
import { cn } from "@/lib/utils"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  )
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div
      role="radiogroup"
      className="grid grid-flow-col auto-cols-fr gap-0.5 rounded-md bg-muted p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-6 rounded-[calc(var(--radius)-2px)] px-2 text-xs font-medium transition-colors",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const TYPE_DOT: Record<string, string> = {
  boolean: "bg-orange-500",
  string: "bg-green-500",
  number: "bg-blue-500",
}

export function Inspector() {
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId)
  const nodes = useGraphStore((s) => s.nodes)
  const updateNodeProps = useGraphStore((s) => s.updateNodeProps)
  const updateNodeLayout = useGraphStore((s) => s.updateNodeLayout)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  if (!selectedNode) {
    return (
      <section className="flex flex-col items-center gap-2 border-t px-4 py-12 text-center">
        <MousePointerClick
          className="size-5 text-muted-foreground/50"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select a node on the canvas
          <br />
          to edit its properties.
        </p>
      </section>
    )
  }

  const config = nodeRegistry[selectedNode.data.componentType]
  if (!config) {
    return (
      <section className="border-t px-4 py-3">
        <SectionTitle>Properties</SectionTitle>
        <p className="text-xs text-destructive">
          Unknown node type: {selectedNode.data.componentType}
        </p>
      </section>
    )
  }

  const fieldErrors = getFieldErrors(
    selectedNode.data.componentType,
    selectedNode.data.props,
  )

  const setProp = (key: string, value: unknown) => {
    updateNodeProps(selectedNode.id, { [key]: value })
  }

  const layout = selectedNode.data.layout ?? { sizeMode: "default" as const }
  const isCustomSize = layout.sizeMode === "custom"

  return (
    <section aria-label="Node properties">
      <div className="px-4 py-3">
        <p className="truncate text-sm font-medium">{config.label}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {selectedNode.id.slice(0, 8)}
        </p>
      </div>

      <div className="border-t px-4 py-3">
        <SectionTitle>Layout</SectionTitle>
        <div className="space-y-2">
          <Segmented
            value={layout.sizeMode}
            options={[
              { value: "default", label: "Auto" },
              { value: "custom", label: "Fixed" },
            ]}
            onChange={(mode) =>
              updateNodeLayout(selectedNode.id, {
                sizeMode: mode,
                ...(mode === "custom"
                  ? {
                      customWidth: layout.customWidth ?? 240,
                      customHeight: layout.customHeight ?? 120,
                    }
                  : {}),
              })
            }
          />

          {isCustomSize && (
            <div className="grid grid-cols-2 gap-2">
              <InputGroup className="h-7">
                <InputGroupAddon align="inline-start" className="pl-2">
                  <InputGroupText className="text-[10px]">W</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  aria-label="Node width"
                  type="number"
                  min={MIN_NODE_WIDTH}
                  className="h-7 text-xs"
                  value={layout.customWidth ?? 240}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    if (Number.isFinite(next) && next >= MIN_NODE_WIDTH) {
                      updateNodeLayout(selectedNode.id, {
                        customWidth: Math.round(next),
                      })
                    }
                  }}
                />
              </InputGroup>
              <InputGroup className="h-7">
                <InputGroupAddon align="inline-start" className="pl-2">
                  <InputGroupText className="text-[10px]">H</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  aria-label="Node height"
                  type="number"
                  min={MIN_NODE_HEIGHT}
                  className="h-7 text-xs"
                  value={layout.customHeight ?? 120}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    if (Number.isFinite(next) && next >= MIN_NODE_HEIGHT) {
                      updateNodeLayout(selectedNode.id, {
                        customHeight: Math.round(next),
                      })
                    }
                  }}
                />
              </InputGroup>
            </div>
          )}
        </div>
      </div>

      {config.configurableProps.length > 0 && (
        <div className="border-t px-4 py-3">
          <SectionTitle>Properties</SectionTitle>
          <div className="space-y-2">
            {config.configurableProps.map((propDef) => {
              const value = selectedNode.data.props[propDef.key]
              const error = fieldErrors[propDef.key]

              return (
                <div key={propDef.key} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <Label
                    htmlFor={`prop-${propDef.key}`}
                    className="truncate text-[11px] font-normal text-muted-foreground"
                  >
                    {propDef.label}
                  </Label>

                  {propDef.inputType === "text" && (
                    <Input
                      id={`prop-${propDef.key}`}
                      className={cn(
                        "h-7 bg-background text-xs shadow-none",
                        error && "border-destructive",
                      )}
                      value={String(value ?? "")}
                      onChange={(e) => setProp(propDef.key, e.target.value)}
                    />
                  )}

                  {propDef.inputType === "select" && (
                    <Select
                      value={String(value ?? propDef.default)}
                      onValueChange={(next) => setProp(propDef.key, next)}
                    >
                      <SelectTrigger
                        id={`prop-${propDef.key}`}
                        className={cn(
                          "h-7 w-full bg-background text-xs shadow-none",
                          error && "border-destructive",
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(propDef.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {propDef.inputType === "boolean" && (
                    <Switch
                      id={`prop-${propDef.key}`}
                      checked={Boolean(value)}
                      onCheckedChange={(checked) => setProp(propDef.key, checked)}
                      className="justify-self-start"
                    />
                  )}

                  {propDef.inputType === "number" && (
                    <Input
                      id={`prop-${propDef.key}`}
                      type="number"
                      className={cn(
                        "h-7 bg-background text-xs shadow-none",
                        error && "border-destructive",
                      )}
                      value={Number(value ?? 0)}
                      onChange={(e) => setProp(propDef.key, Number(e.target.value))}
                    />
                  )}

                  {error && (
                    <p className="col-start-2 text-[11px] text-destructive">
                      {error}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedNode.data.componentType === "form" && (
        <div className="border-t px-4 py-3">
          <SectionTitle>Form fields</SectionTitle>
          <FormFieldsEditor
            fields={
              Array.isArray(selectedNode.data.props.fields)
                ? (selectedNode.data.props.fields as {
                    name: string
                    type: "text" | "email" | "password" | "number"
                    required: boolean
                    placeholder?: string
                  }[])
                : []
            }
            onChange={(fields) => setProp("fields", fields)}
          />
        </div>
      )}

      {selectedNode.data.componentType === "select" && (
        <div className="border-t px-4 py-3">
          <SectionTitle>Options</SectionTitle>
          <SelectOptionsEditor
            options={
              Array.isArray(selectedNode.data.props.options)
                ? (selectedNode.data.props.options as string[])
                : ["Option 1", "Option 2"]
            }
            onChange={(options) => setProp("options", options)}
          />
        </div>
      )}

      {(config.inputs.length > 0 || config.outputs.length > 0) && (
        <div className="border-t px-4 py-3">
          <SectionTitle>Data</SectionTitle>
          <div className="space-y-1.5">
            {[...config.inputs, ...config.outputs].map((port) => (
              <div
                key={`${port.type}-${port.key}`}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      TYPE_DOT[port.type] ?? "bg-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate text-muted-foreground">
                    {port.label}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-foreground">
                  {String(selectedNode.data.state[port.key] ?? "—")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
