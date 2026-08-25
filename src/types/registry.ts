export type ConfigurableProp = {
  key: string
  label: string
  inputType: "text" | "select" | "boolean" | "number" | "color"
  options?: string[]
  default: unknown
}

export type PortDef = {
  key: string
  label: string
  type: "boolean" | "string" | "number"
}

export type NodeConfig = {
  type: string
  label: string
  category:
    | "form"
    | "layout"
    | "feedback"
    | "navigation"
    | "overlay"
    | "display"
    | "data"
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
}
