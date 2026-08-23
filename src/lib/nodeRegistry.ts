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
    defaultProps: {
      title: "Untitled Form",
      fields: [
        {
          name: "email",
          type: "email",
          required: true,
          placeholder: "Email address",
        },
      ],
    },
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
  tabs: {
    type: "tabs",
    label: "Tabs",
    category: "layout",
    defaultProps: { defaultValue: "tab-1" },
    configurableProps: [],
    inputs: [],
    outputs: [],
  },
  separator: {
    type: "separator",
    label: "Separator",
    category: "layout",
    defaultProps: {},
    configurableProps: [],
    inputs: [],
    outputs: [],
  },
  skeleton: {
    type: "skeleton",
    label: "Skeleton",
    category: "feedback",
    defaultProps: { width: "12rem", height: "2.5rem" },
    configurableProps: [
      {
        key: "width",
        label: "Width",
        inputType: "text",
        default: "12rem",
      },
      {
        key: "height",
        label: "Height",
        inputType: "text",
        default: "2.5rem",
      },
    ],
    inputs: [],
    outputs: [],
  },
  "button-group": {
    type: "button-group",
    label: "Button Group",
    category: "form",
    defaultProps: {},
    configurableProps: [],
    inputs: [],
    outputs: [],
  },
  calendar: {
    type: "calendar",
    label: "Calendar",
    category: "form",
    defaultProps: {},
    configurableProps: [],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "value", label: "Selected Date", type: "string" }],
  },
  field: {
    type: "field",
    label: "Field",
    category: "form",
    defaultProps: {
      label: "Username",
      description: "Choose a unique handle.",
      error: "",
    },
    configurableProps: [
      { key: "label", label: "Label", inputType: "text", default: "Username" },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Choose a unique handle.",
      },
      { key: "error", label: "Error", inputType: "text", default: "" },
    ],
    inputs: [],
    outputs: [],
  },
  "native-select": {
    type: "native-select",
    label: "Native Select",
    category: "form",
    defaultProps: {
      placeholder: "Fruit",
      options: ["Apple", "Banana", "Cherry"],
    },
    configurableProps: [
      {
        key: "placeholder",
        label: "Placeholder",
        inputType: "text",
        default: "Fruit",
      },
    ],
    inputs: [{ key: "disabled", label: "Disabled", type: "boolean" }],
    outputs: [{ key: "value", label: "Value", type: "string" }],
  },
  carousel: {
    type: "carousel",
    label: "Carousel",
    category: "layout",
    defaultProps: { slides: 4 },
    configurableProps: [
      { key: "slides", label: "Slides", inputType: "number", default: 4 },
    ],
    inputs: [],
    outputs: [],
  },
  item: {
    type: "item",
    label: "Item",
    category: "layout",
    defaultProps: {
      title: "Permissions",
      description: "Manage who can access this project.",
    },
    configurableProps: [
      { key: "title", label: "Title", inputType: "text", default: "Permissions" },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Manage who can access this project.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  dialog: {
    type: "dialog",
    label: "Dialog",
    category: "overlay",
    defaultProps: {
      triggerLabel: "Open Dialog",
      title: "Delete project?",
      description:
        "This action cannot be undone. The project will be permanently deleted.",
    },
    configurableProps: [
      {
        key: "triggerLabel",
        label: "Trigger",
        inputType: "text",
        default: "Open Dialog",
      },
      { key: "title", label: "Title", inputType: "text", default: "Delete project?" },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default:
          "This action cannot be undone. The project will be permanently deleted.",
      },
    ],
    inputs: [],
    outputs: [{ key: "confirmed", label: "Confirmed", type: "boolean" }],
  },
  drawer: {
    type: "drawer",
    label: "Drawer",
    category: "overlay",
    defaultProps: {
      triggerLabel: "Open Drawer",
      title: "Drawer Title",
      description: "Drag the handle or press Esc to close.",
    },
    configurableProps: [
      {
        key: "triggerLabel",
        label: "Trigger",
        inputType: "text",
        default: "Open Drawer",
      },
      { key: "title", label: "Title", inputType: "text", default: "Drawer Title" },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Drag the handle or press Esc to close.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  "hover-card": {
    type: "hover-card",
    label: "Hover Card",
    category: "overlay",
    defaultProps: {
      trigger: "@shadcn",
      heading: "shadcn/ui",
      bio: "The foundation for your design system and component library.",
    },
    configurableProps: [
      { key: "trigger", label: "Trigger", inputType: "text", default: "@shadcn" },
      { key: "heading", label: "Heading", inputType: "text", default: "shadcn/ui" },
      {
        key: "bio",
        label: "Bio",
        inputType: "text",
        default:
          "The foundation for your design system and component library.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  command: {
    type: "command",
    label: "Command Menu",
    category: "navigation",
    defaultProps: { placeholder: "Type a command or search..." },
    configurableProps: [
      {
        key: "placeholder",
        label: "Placeholder",
        inputType: "text",
        default: "Type a command or search...",
      },
    ],
    inputs: [],
    outputs: [{ key: "selected", label: "Selected", type: "string" }],
  },
  bubble: {
    type: "bubble",
    label: "Chat Bubble",
    category: "display",
    defaultProps: {
      text: "Looks great — shipping it!",
      variant: "received",
    },
    configurableProps: [
      {
        key: "text",
        label: "Text",
        inputType: "text",
        default: "Looks great — shipping it!",
      },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: ["sent", "received"],
        default: "received",
      },
    ],
    inputs: [],
    outputs: [],
  },
  message: {
    type: "message",
    label: "Message",
    category: "display",
    defaultProps: {
      text: "Can you review the latest mockups?",
      role: "Ada",
      variant: "received",
    },
    configurableProps: [
      {
        key: "text",
        label: "Text",
        inputType: "text",
        default: "Can you review the latest mockups?",
      },
      { key: "role", label: "Author", inputType: "text", default: "Ada" },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: ["sent", "received"],
        default: "received",
      },
    ],
    inputs: [],
    outputs: [],
  },
  "message-scroller": {
    type: "message-scroller",
    label: "Message Scroller",
    category: "display",
    defaultProps: {},
    configurableProps: [],
    inputs: [],
    outputs: [],
  },
  empty: {
    type: "empty",
    label: "Empty State",
    category: "feedback",
    defaultProps: {
      title: "No results found",
      description: "Try adjusting your filters or a different query.",
    },
    configurableProps: [
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "No results found",
      },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Try adjusting your filters or a different query.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  chart: {
    type: "chart",
    label: "Bar Chart",
    category: "display",
    defaultProps: {},
    configurableProps: [],
    inputs: [],
    outputs: [],
  },
  kbd: {
    type: "kbd",
    label: "Keyboard Key",
    category: "display",
    defaultProps: { keys: "Ctrl K" },
    configurableProps: [
      { key: "keys", label: "Keys", inputType: "text", default: "Ctrl K" },
    ],
    inputs: [],
    outputs: [],
  },
  marker: {
    type: "marker",
    label: "Highlight",
    category: "display",
    defaultProps: {
      text: "Design tokens keep the system consistent.",
      highlight: "design tokens",
    },
    configurableProps: [
      {
        key: "text",
        label: "Text",
        inputType: "text",
        default: "Design tokens keep the system consistent.",
      },
      {
        key: "highlight",
        label: "Highlight",
        inputType: "text",
        default: "design tokens",
      },
    ],
    inputs: [],
    outputs: [],
  },
  direction: {
    type: "direction",
    label: "Direction",
    category: "layout",
    defaultProps: { dir: "ltr" },
    configurableProps: [
      {
        key: "dir",
        label: "Direction",
        inputType: "select",
        options: ["ltr", "rtl"],
        default: "ltr",
      },
    ],
    inputs: [],
    outputs: [],
  },
  toast: {
    type: "toast",
    label: "Toast",
    category: "feedback",
    defaultProps: {
      message: "Changes saved",
      variant: "success",
    },
    configurableProps: [
      {
        key: "message",
        label: "Message",
        inputType: "text",
        default: "Changes saved",
      },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: ["success", "error"],
        default: "success",
      },
    ],
    inputs: [{ key: "trigger", label: "Trigger", type: "boolean" }],
    outputs: [{ key: "fired", label: "Fired", type: "boolean" }],
  },
}

// Every component supports loading logic: wire any boolean output into
// the standard `loading` port to show its skeleton form while loading.
for (const config of Object.values(nodeRegistry)) {
  if (!config.inputs.some((input) => input.key === "loading")) {
    config.inputs.push({ key: "loading", label: "Loading", type: "boolean" })
  }
}

export const categoryLabels: Record<NodeConfig["category"], string> = {
  form: "Form",
  layout: "Layout",
  feedback: "Feedback",
  navigation: "Navigation",
  overlay: "Overlay",
  display: "Display",
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
