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
  category: "form" | "layout" | "feedback" | "navigation"
  defaultProps: Record<string, unknown>
  configurableProps: ConfigurableProp[]
  inputs: PortDef[]
  outputs: PortDef[]
}

export const nodeRegistry: Record<string, NodeConfig> = {
  button: {
    type: "button",
    label: "Button",
    category: "form",
    defaultProps: { label: "Click me", variant: "default", size: "default" },
    configurableProps: [
      { key: "label", label: "Label", inputType: "text", default: "Click me" },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        default: "default",
      },
      {
        key: "size",
        label: "Size",
        inputType: "select",
        options: ["default", "sm", "lg", "icon"],
        default: "default",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "pressed", label: "Pressed", type: "boolean" }],
  },
  form: {
    type: "form",
    label: "Form",
    category: "form",
    defaultProps: { title: "Untitled Form", fields: [] },
    configurableProps: [
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "Untitled Form",
      },
    ],
    inputs: [{ key: "active", label: "Active", type: "boolean" }],
    outputs: [
      { key: "submitted", label: "Submitted", type: "boolean" },
      { key: "isValid", label: "Is Valid", type: "boolean" },
    ],
  },
  input: {
    type: "input",
    label: "Input",
    category: "form",
    defaultProps: { placeholder: "Enter text", inputType: "text" },
    configurableProps: [
      {
        key: "placeholder",
        label: "Placeholder",
        inputType: "text",
        default: "Enter text",
      },
      {
        key: "inputType",
        label: "Type",
        inputType: "select",
        options: ["text", "email", "password", "number"],
        default: "text",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "value", label: "Value", type: "string" }],
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    category: "form",
    defaultProps: { label: "Accept terms" },
    configurableProps: [
      {
        key: "label",
        label: "Label",
        inputType: "text",
        default: "Accept terms",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "checked", label: "Checked", type: "boolean" }],
  },
  select: {
    type: "select",
    label: "Select",
    category: "form",
    defaultProps: {
      placeholder: "Select option",
      options: ["Option 1", "Option 2", "Option 3"],
    },
    configurableProps: [
      {
        key: "placeholder",
        label: "Placeholder",
        inputType: "text",
        default: "Select option",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "value", label: "Value", type: "string" }],
  },
  switch: {
    type: "switch",
    label: "Switch",
    category: "form",
    defaultProps: { label: "Enable notifications" },
    configurableProps: [
      {
        key: "label",
        label: "Label",
        inputType: "text",
        default: "Enable notifications",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "checked", label: "Checked", type: "boolean" }],
  },
  textarea: {
    type: "textarea",
    label: "Textarea",
    category: "form",
    defaultProps: { placeholder: "Enter message" },
    configurableProps: [
      {
        key: "placeholder",
        label: "Placeholder",
        inputType: "text",
        default: "Enter message",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "value", label: "Value", type: "string" }],
  },
  card: {
    type: "card",
    label: "Card",
    category: "layout",
    defaultProps: {
      title: "Card Title",
      description: "Card description goes here",
    },
    configurableProps: [
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "Card Title",
      },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Card description goes here",
      },
    ],
    inputs: [],
    outputs: [],
  },
  badge: {
    type: "badge",
    label: "Badge",
    category: "feedback",
    defaultProps: { label: "Badge", variant: "default" },
    configurableProps: [
      { key: "label", label: "Label", inputType: "text", default: "Badge" },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: ["default", "secondary", "destructive", "outline"],
        default: "default",
      },
    ],
    inputs: [],
    outputs: [],
  },
  label: {
    type: "label",
    label: "Label",
    category: "form",
    defaultProps: { text: "Email address" },
    configurableProps: [
      {
        key: "text",
        label: "Text",
        inputType: "text",
        default: "Email address",
      },
    ],
    inputs: [],
    outputs: [],
  },
}

export const categoryLabels: Record<NodeConfig["category"], string> = {
  form: "Form",
  layout: "Layout",
  feedback: "Feedback",
  navigation: "Navigation",
}

export function getNodesByCategory() {
  const groups = new Map<NodeConfig["category"], NodeConfig[]>()

  for (const config of Object.values(nodeRegistry)) {
    const list = groups.get(config.category) ?? []
    list.push(config)
    groups.set(config.category, list)
  }

  return groups
}
