export type { TransformType } from "@/types/graph"

export function evalTransform(
  transform: string,
  value: boolean | string | number,
): boolean | string | number {
  switch (transform) {
    case "invert":
      return typeof value === "boolean" ? !value : value
    case "negate":
      return typeof value === "number" ? -value : value
    case "isLoading":
      return value === "loading"
    case "isError":
      return value === "error"
    case "isSuccess":
      return value === "success"
    case "passthrough":
    default:
      return value
  }
}

/** @deprecated use evalTransform */
export const applyTransform = evalTransform

export function edgeStrokeColor(transform?: string): string {
  if (transform === "invert") return "#f97316"
  return "#22c55e"
}

export const EDGE_TRANSFORMS = [
  { value: "passthrough", label: "Passthrough" },
  { value: "invert", label: "Invert" },
  { value: "negate", label: "Negate (numbers)" },
  { value: "isLoading", label: "Is Loading (status check)" },
  { value: "isError", label: "Is Error (status check)" },
  { value: "isSuccess", label: "Is Success (status check)" },
] as const
