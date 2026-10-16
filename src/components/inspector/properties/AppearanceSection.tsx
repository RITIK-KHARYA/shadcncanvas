import { CollapsibleSection } from "@/components/inspector/CollapsibleSection"
import { PropFields } from "@/components/inspector/properties/PropFields"
import { getFieldErrors } from "@/lib/registry"
import type { NodeConfig } from "@/lib/registry"
import { useGraphStore } from "@/store/graph-store"
import type { CanvasNode } from "@/types/graph"

export function AppearanceSection({
  node,
  config,
}: {
  node: CanvasNode
  config: NodeConfig
}) {
  const updateNodeProps = useGraphStore((s) => s.updateNodeProps)

  if (config.configurableProps.length === 0) return null

  const fieldErrors = getFieldErrors(node.data.componentType, node.data.props)
  const setProp = (key: string, value: unknown) => {
    updateNodeProps(node.id, { [key]: value })
  }

  return (
    <CollapsibleSection id="appearance" title="Appearance">
      <PropFields
        propDefs={config.configurableProps}
        values={node.data.props}
        errors={fieldErrors}
        onChange={setProp}
      />
    </CollapsibleSection>
  )
}
