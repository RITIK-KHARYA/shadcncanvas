import { useMemo } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { cn } from "@/lib/utils"

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
      <section className="rounded-lg border bg-background/60 p-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Props
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">No node selected.</p>
      </section>
    )
  }

  const config = nodeRegistry[selectedNode.data.componentType]
  if (!config) {
    return (
      <section className="rounded-lg border bg-background/60 p-3">
        <p className="text-sm text-destructive">Unknown node type.</p>
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
    <section className="rounded-lg border bg-background/60 p-3">
      <div className="mb-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Props
        </h3>
        <p className="mt-1 text-sm font-medium">{config.label}</p>
      </div>

      <div className="mb-4 space-y-3 border-b pb-4">
        <div className="space-y-1.5">
          <Label htmlFor="node-size-mode" className="text-xs">
            Node size
          </Label>
          <Select
            value={layout.sizeMode}
            onValueChange={(value: "default" | "custom") =>
              updateNodeLayout(selectedNode.id, {
                sizeMode: value,
                ...(value === "custom"
                  ? {
                      customWidth: layout.customWidth ?? 240,
                      customHeight: layout.customHeight ?? 120,
                    }
                  : {}),
              })
            }
          >
            <SelectTrigger id="node-size-mode" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isCustomSize && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="node-width" className="text-xs">
                Width (px)
              </Label>
              <Input
                id="node-width"
                type="number"
                min={80}
                className="h-8"
                value={layout.customWidth ?? 240}
                onChange={(e) =>
                  updateNodeLayout(selectedNode.id, {
                    customWidth: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="node-height" className="text-xs">
                Min height (px)
              </Label>
              <Input
                id="node-height"
                type="number"
                min={40}
                className="h-8"
                value={layout.customHeight ?? 120}
                onChange={(e) =>
                  updateNodeLayout(selectedNode.id, {
                    customHeight: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {config.configurableProps.map((propDef) => {
          const value = selectedNode.data.props[propDef.key]
          const error = fieldErrors[propDef.key]

          return (
            <div key={propDef.key} className="space-y-1.5">
              <Label htmlFor={`prop-${propDef.key}`} className="text-xs">
                {propDef.label}
              </Label>

              {propDef.inputType === "text" && (
                <Input
                  id={`prop-${propDef.key}`}
                  className={cn("h-8", error && "border-destructive")}
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
                    className={cn("h-8", error && "border-destructive")}
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
                />
              )}

              {propDef.inputType === "number" && (
                <Input
                  id={`prop-${propDef.key}`}
                  type="number"
                  className={cn("h-8", error && "border-destructive")}
                  value={Number(value ?? 0)}
                  onChange={(e) => setProp(propDef.key, Number(e.target.value))}
                />
              )}

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </div>
          )
        })}
      </div>

      {selectedNode.data.componentType === "form" && (
        <div className="mt-4 border-t pt-3">
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
        <div className="mt-4 border-t pt-3">
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
        <div className="mt-4 space-y-2 border-t pt-3">
          {config.inputs.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                Inputs
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {config.inputs.map((input) => (
                  <li key={input.key}>
                    {input.label} ({input.type}):{" "}
                    <span className="font-mono text-foreground">
                      {String(selectedNode.data.state[input.key] ?? "—")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {config.outputs.length > 0 && (
            <div>
              <p className="text-[11px] font-medium uppercase text-muted-foreground">
                Outputs
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {config.outputs.map((output) => (
                  <li key={output.key}>
                    {output.label} ({output.type}):{" "}
                    <span className="font-mono text-foreground">
                      {String(selectedNode.data.state[output.key] ?? "—")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
