import type { UiComponentDef } from "@/types/registry"

export const UI_COMPONENTS: Record<string, UiComponentDef> = {
  button: { exportName: "Button", importPath: "button" },
  input: { exportName: "Input", importPath: "input" },
  textarea: { exportName: "Textarea", importPath: "textarea" },
  checkbox: { exportName: "Checkbox", importPath: "checkbox" },
  switch: { exportName: "Switch", importPath: "switch" },
  select: { exportName: "Select", importPath: "select" },
  label: { exportName: "Label", importPath: "label" },
  badge: { exportName: "Badge", importPath: "badge" },
  card: { exportName: "Card", importPath: "card" },
  form: { exportName: "Card", importPath: "card" },
  tabs: { exportName: "Tabs", importPath: "tabs" },
  separator: { exportName: "Separator", importPath: "separator" },
  skeleton: { exportName: "Skeleton", importPath: "skeleton" },
  "button-group": { exportName: "ButtonGroup", importPath: "button-group" },
  calendar: { exportName: "Calendar", importPath: "calendar" },
  field: { exportName: "Field", importPath: "field" },
  "native-select": {
    exportName: "NativeSelect",
    importPath: "native-select",
  },
  carousel: { exportName: "Carousel", importPath: "carousel" },
  item: { exportName: "Item", importPath: "item" },
  dialog: { exportName: "Dialog", importPath: "dialog" },
  drawer: { exportName: "Drawer", importPath: "drawer" },
  "hover-card": { exportName: "HoverCard", importPath: "hover-card" },
  command: { exportName: "Command", importPath: "command" },
  bubble: { exportName: "Bubble", importPath: "bubble" },
  message: { exportName: "Message", importPath: "message" },
  "message-scroller": {
    exportName: "MessageScroller",
    importPath: "message-scroller",
  },
  empty: { exportName: "Empty", importPath: "empty" },
  chart: { exportName: "ChartContainer", importPath: "chart" },
  kbd: { exportName: "Kbd", importPath: "kbd" },
  marker: { exportName: "Marker", importPath: "marker" },
  direction: { exportName: "DirectionProvider", importPath: "direction" },
  toast: { exportName: "toast", importPath: "sonner" },
  apiCall: { exportName: "Button", importPath: "button" },
  "grid-bar": {
    exportName: "EChartsGridBarChart",
    importPath: "evilcharts/blocks/grid-echarts-bar-chart",
  },
  "monospace-bar": {
    exportName: "EChartsMonospaceBarChart",
    importPath: "evilcharts/blocks/monospace-echarts-bar-chart",
  },
  "shipments-line": {
    exportName: "EChartsShipmentsLineChart",
    importPath: "evilcharts/blocks/shipments-echarts-line-chart",
  },
  "payouts-line": {
    exportName: "EChartsPayoutsLineChart",
    importPath: "evilcharts/blocks/payouts-echarts-line-chart",
  },
  "latency-area": {
    exportName: "EChartsLatencyAreaChart",
    importPath: "evilcharts/blocks/latency-echarts-area-chart",
  },
  "benchmark-area": {
    exportName: "EChartsBenchmarkAreaChart",
    importPath: "evilcharts/blocks/benchmark-echarts-area-chart",
  },
  "audience-area": {
    exportName: "EChartsAudienceAreaChart",
    importPath: "evilcharts/blocks/audience-echarts-area-chart",
  },
  "portfolio-area": {
    exportName: "EChartsPortfolioAreaChart",
    importPath: "evilcharts/blocks/portfolio-echarts-area-chart",
  },
  "revenue-mix-pie": {
    exportName: "EChartsRevenueMixPieChart",
    importPath: "evilcharts/blocks/revenue-mix-echarts-pie-chart",
  },
  "reliability-pie": {
    exportName: "EChartsReliabilityScorePieChart",
    importPath: "evilcharts/blocks/reliability-score-echarts-pie-chart",
  },
  "progress-rings-pie": {
    exportName: "EChartsProgressRingsPieChart",
    importPath: "evilcharts/blocks/progress-rings-echarts-pie-chart",
  },
  "market-share-pie": {
    exportName: "EChartsMarketSharePieChart",
    importPath: "evilcharts/blocks/market-share-echarts-pie-chart",
  },
  "cache-tiers-radial": {
    exportName: "EChartsCacheTiersRadialChart",
    importPath: "evilcharts/blocks/cache-tiers-echarts-radial-chart",
  },
  "ride-radial": {
    exportName: "EChartsRideRadialChart",
    importPath: "evilcharts/blocks/ride-echarts-radial-chart",
  },
  "allocation-sankey": {
    exportName: "EChartsAllocationSankeyChart",
    importPath: "evilcharts/blocks/allocation-echarts-sankey-chart",
  },
}
