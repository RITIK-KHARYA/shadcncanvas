import type { NodeConfig } from "@/types/registry";

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
      { key: "payload", label: "Payload", type: "string" },
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
    defaultProps: {
      defaultValue: "tab-1",
      tabs: [
        { id: "tab-1", label: "Tab 1" },
        { id: "tab-2", label: "Tab 2" },
      ],
    },
    configurableProps: [
      {
        key: "defaultValue",
        label: "Default Value",
        inputType: "text",
        default: "tab-1",
      },
    ],
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
    inputs: [{ key: "goToSlide", label: "Go To Slide", type: "number" }],
    outputs: [{ key: "currentSlide", label: "Current Slide", type: "number" }],
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
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "Permissions",
      },
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
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "Delete project?",
      },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default:
          "This action cannot be undone. The project will be permanently deleted.",
      },
    ],
    inputs: [{ key: "open", label: "Open", type: "boolean" }],
    outputs: [
      { key: "confirmed", label: "Confirmed", type: "boolean" },
      { key: "open", label: "Open", type: "boolean" },
    ],
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
      {
        key: "title",
        label: "Title",
        inputType: "text",
        default: "Drawer Title",
      },
      {
        key: "description",
        label: "Description",
        inputType: "text",
        default: "Drag the handle or press Esc to close.",
      },
    ],
    inputs: [{ key: "open", label: "Open", type: "boolean" }],
    outputs: [{ key: "open", label: "Open", type: "boolean" }],
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
      {
        key: "trigger",
        label: "Trigger",
        inputType: "text",
        default: "@shadcn",
      },
      {
        key: "heading",
        label: "Heading",
        inputType: "text",
        default: "shadcn/ui",
      },
      {
        key: "bio",
        label: "Bio",
        inputType: "text",
        default: "The foundation for your design system and component library.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  command: {
    type: "command",
    label: "Command Menu",
    category: "navigation",
    defaultProps: {
      placeholder: "Type a command or search...",
      items: [
        { id: "calendar", label: "Calendar" },
        { id: "search", label: "Search Emoji" },
        { id: "settings", label: "Settings" },
      ],
    },
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
      visible: true,
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
    inputs: [{ key: "visible", label: "Visible", type: "boolean" }],
    outputs: [],
  },
  chart: {
    type: "chart",
    label: "Bar Chart",
    category: "display",
    defaultProps: {
      chartType: "bar",
      dataMode: "static",
      staticData: JSON.stringify(
        [
          { month: "Jan", desktop: 186, mobile: 80 },
          { month: "Feb", desktop: 305, mobile: 200 },
          { month: "Mar", desktop: 237, mobile: 120 },
          { month: "Apr", desktop: 173, mobile: 190 },
          { month: "May", desktop: 209, mobile: 130 },
        ],
        null,
        2,
      ),
    },
    configurableProps: [
      {
        key: "chartType",
        label: "Chart Type",
        inputType: "select",
        options: ["bar", "line", "pie"],
        default: "bar",
      },
      {
        key: "dataMode",
        label: "Data Source",
        inputType: "select",
        options: ["static", "bound"],
        default: "static",
      },
      {
        key: "staticData",
        label: "Static Data (JSON)",
        inputType: "text",
        default:
          '[{"month":"Jan","desktop":186},{"month":"Feb","desktop":305}]',
      },
    ],
    inputs: [{ key: "data", label: "Data", type: "string" }],
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
      successMessage: "Login successful!",
      errorMessage: "Login failed. Check credentials.",
      variant: "success",
      statusVariant: "auto",
    },
    configurableProps: [
      {
        key: "message",
        label: "Message",
        inputType: "text",
        default: "Changes saved",
      },
      {
        key: "successMessage",
        label: "Success Message",
        inputType: "text",
        default: "Login successful!",
      },
      {
        key: "errorMessage",
        label: "Error Message",
        inputType: "text",
        default: "Login failed. Check credentials.",
      },
      {
        key: "variant",
        label: "Default Variant",
        inputType: "select",
        options: ["success", "error"],
        default: "success",
      },
      {
        key: "statusVariant",
        label: "Color Mode",
        inputType: "select",
        options: ["auto", "success", "error", "info"],
        default: "auto",
      },
    ],
    inputs: [
      { key: "trigger", label: "Trigger", type: "boolean" },
      { key: "status", label: "Status", type: "string" },
      { key: "isSuccess", label: "Success", type: "boolean" },
      { key: "isError", label: "Error", type: "boolean" },
    ],
    outputs: [{ key: "fired", label: "Fired", type: "boolean" }],
  },
  apiCall: {
    type: "apiCall",
    label: "API Call",
    category: "data",
    defaultProps: {
      url: "",
      method: "POST",
      headers: [],
      bodyMode: "bound",
      staticBody: "{}",
      timeoutMs: 10000,
    },
    configurableProps: [
      { key: "url", label: "Endpoint URL", inputType: "text", default: "" },
      {
        key: "method",
        label: "Method",
        inputType: "select",
        options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        default: "POST",
      },
      {
        key: "bodyMode",
        label: "Body Source",
        inputType: "select",
        options: ["bound", "static"],
        default: "bound",
      },
      {
        key: "staticBody",
        label: "Static Body (JSON)",
        inputType: "text",
        default: "{}",
      },
      {
        key: "timeoutMs",
        label: "Timeout (ms)",
        inputType: "number",
        default: 10000,
      },
    ],
    inputs: [
      { key: "trigger", label: "Trigger", type: "boolean" },
      { key: "payload", label: "Payload", type: "string" },
    ],
    outputs: [
      { key: "status", label: "Status", type: "string" },
      { key: "data", label: "Response Data", type: "string" },
      { key: "error", label: "Error Message", type: "string" },
      { key: "isLoading", label: "Loading", type: "boolean" },
      { key: "isSuccess", label: "Success", type: "boolean" },
      { key: "isError", label: "Error", type: "boolean" },
    ],
  },
  "grid-bar": {
    type: "grid-bar",
    label: "ECharts Grid Bar",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"hour":"08:00","sessions":98},{"hour":"12:00","sessions":158},{"hour":"16:00","sessions":152},{"hour":"20:00","sessions":84}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"hour":"08:00","sessions":98},{"hour":"12:00","sessions":158}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "monospace-bar": {
    type: "monospace-bar",
    label: "ECharts Monospace Bar",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"month":"Jan \'25","sales":388},{"month":"Feb \'25","sales":912},{"month":"Mar \'25","sales":564}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"month":"Jan \'25","sales":388},{"month":"Feb \'25","sales":912}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "shipments-line": {
    type: "shipments-line",
    label: "ECharts Shipments Line",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"slot":"Mon 1","current":14,"previous":34},{"slot":"Mon 2","current":9,"previous":41},{"slot":"Mon 3","current":18,"previous":37}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"slot":"Mon 1","current":14,"previous":34},{"slot":"Mon 2","current":9,"previous":41}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "payouts-line": {
    type: "payouts-line",
    label: "ECharts Payouts Line",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"month":"Jan","payouts":312,"pending":548},{"month":"Feb","payouts":388,"pending":502},{"month":"Mar","payouts":342,"pending":561}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"month":"Jan","payouts":312,"pending":548},{"month":"Feb","payouts":388,"pending":502}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "latency-area": {
    type: "latency-area",
    label: "ECharts Latency Area",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"time":"Today 13:06","p99":188,"p95":92,"p75":44,"p50":20},{"time":"Today 13:07","p99":196,"p95":95,"p75":46,"p50":21},{"time":"Today 13:08","p99":181,"p95":89,"p75":43,"p50":20}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"time":"Today 13:06","p99":188,"p95":92,"p75":44,"p50":20},{"time":"Today 13:07","p99":196,"p95":95,"p75":46,"p50":21}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "benchmark-area": {
    type: "benchmark-area",
    label: "ECharts Benchmark Area",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"date":"Jan 1","actual":240,"target":125},{"date":"Jan 8","actual":240,"target":125},{"date":"Jan 15","actual":175,"target":200}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"date":"Jan 1","actual":240,"target":125},{"date":"Jan 8","actual":240,"target":125}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "audience-area": {
    type: "audience-area",
    label: "ECharts Audience Area",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"month":"Jan","listeners":2980},{"month":"Feb","listeners":3120},{"month":"Mar","listeners":3460}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"month":"Jan","listeners":2980},{"month":"Feb","listeners":3120}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "portfolio-area": {
    type: "portfolio-area",
    label: "ECharts Portfolio Area",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"date":"Dec 22","robinhood":53916,"coinbase":53670},{"date":"Dec 23","robinhood":54380,"coinbase":53080},{"date":"Dec 24","robinhood":54760,"coinbase":52460}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"date":"Dec 22","robinhood":53916,"coinbase":53670},{"date":"Dec 23","robinhood":54380,"coinbase":53080}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "revenue-mix-pie": {
    type: "revenue-mix-pie",
    label: "ECharts Revenue Mix Pie",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"channel":"direct","value":52400},{"channel":"marketplace","value":38900},{"channel":"wholesale","value":24150}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"channel":"direct","value":52400},{"channel":"marketplace","value":38900}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "reliability-pie": {
    type: "reliability-pie",
    label: "ECharts Reliability Pie",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"band":"atrisk","value":450},{"band":"fair","value":200},{"band":"good","value":170}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"band":"atrisk","value":450},{"band":"fair","value":200},{"band":"good","value":170}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "progress-rings-pie": {
    type: "progress-rings-pie",
    label: "ECharts Progress Rings",
    category: "charts",
    defaultProps: { value: 48, caption: "Additional support requests from users." },
    configurableProps: [
      { key: "value", label: "Progress (%)", inputType: "number", default: 48 },
      {
        key: "caption",
        label: "Caption",
        inputType: "text",
        default: "Additional support requests from users.",
      },
    ],
    inputs: [],
    outputs: [],
  },
  "market-share-pie": {
    type: "market-share-pie",
    label: "ECharts Market Share Pie",
    category: "charts",
    defaultProps: {
      chartData:
        '[{"product":"skyline","value":27},{"product":"datawell","value":21},{"product":"cloudpeak","value":13}]',
    },
    configurableProps: [
      {
        key: "chartData",
        label: "Chart Data (JSON)",
        inputType: "text",
        default:
          '[{"product":"skyline","value":27},{"product":"datawell","value":21}]',
      },
    ],
    inputs: [],
    outputs: [],
  },
  "cache-tiers-radial": {
    type: "cache-tiers-radial",
    label: "ECharts Cache Tiers",
    category: "charts",
    defaultProps: { total: 1000, hits: 610 },
    configurableProps: [
      { key: "total", label: "Total Requests", inputType: "number", default: 1000 },
      { key: "hits", label: "L1 Hits", inputType: "number", default: 610 },
    ],
    inputs: [],
    outputs: [],
  },
  "ride-radial": {
    type: "ride-radial",
    label: "ECharts Ride Radial",
    category: "charts",
    defaultProps: { distance: 18.4, goal: 25 },
    configurableProps: [
      { key: "distance", label: "Distance", inputType: "number", default: 18.4 },
      { key: "goal", label: "Goal", inputType: "number", default: 25 },
    ],
    inputs: [],
    outputs: [],
  },
  "allocation-sankey": {
    type: "allocation-sankey",
    label: "ECharts Allocation Sankey",
    category: "charts",
    defaultProps: { title: "Where the fund flows" },
    configurableProps: [
      { key: "title", label: "Title", inputType: "text", default: "Where the fund flows" },
    ],
    inputs: [],
    outputs: [],
  },
};

for (const config of Object.values(nodeRegistry)) {
  if (config.type === "toast") continue;
  if (!config.inputs.some((input) => input.key === "loading")) {
    config.inputs.push({ key: "loading", label: "Loading", type: "boolean" });
  }
}

export const categoryLabels: Record<NodeConfig["category"], string> = {
  form: "Form",
  layout: "Layout",
  feedback: "Feedback",
  navigation: "Navigation",
  overlay: "Overlay",
  display: "Display",
  data: "Data",
  charts: "Charts",
};

export function getNodesByCategory() {
  const groups = new Map<NodeConfig["category"], NodeConfig[]>();

  for (const config of Object.values(nodeRegistry)) {
    const list = groups.get(config.category) ?? [];
    list.push(config);
    groups.set(config.category, list);
  }

  return groups;
}

