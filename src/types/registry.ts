export type ConfigurableProp = {
  key: string
  label: string
  inputType: "text" | "select" | "boolean" | "number" | "color"
  options?: string[]
  default: unknown
  min?: number
  max?: number
  step?: number
}

export type PortDef = {
  key: string
  label: string
  type: "boolean" | "string" | "number"
}

export type NodeCategory =
  | "loading"
  | "form"
  | "layout"
  | "feedback"
  | "navigation"
  | "overlay"
  | "display"
  | "data"
  | "charts"
  | "ai"
  | "effects"

export type NodeConfig = {
  type: string
  label: string
  category: NodeCategory
  defaultProps: Record<string, unknown>
  configurableProps: ConfigurableProp[]
  inputs: PortDef[]
  outputs: PortDef[]
}

export type FormField = {
  name: string
  type: string
  required?: boolean
  placeholder?: string
}

export type ApiHeader = {
  key: string
  value: string
}

export type UiComponentDef = {
  exportName: string
  importPath: string
  /** npm package name — when set, codegen imports from the package instead of "@/components/ui/". */
  pkg?: string
}

/** A visual effect attached to a host node (decorator, not a node of its own). */
export type EffectConfig = {
  id: string
  props: Record<string, unknown>
}
