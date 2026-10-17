export const DND_MIME = "application/reactflow"

export const DND_PROPS_MIME = "application/reactflow-props"

export function setComponentDragData(
  dataTransfer: DataTransfer,
  componentType: string,
  initialProps?: Record<string, unknown>,
) {
  dataTransfer.clearData()
  dataTransfer.setData(DND_MIME, componentType)
  dataTransfer.setData("text/plain", componentType)
  if (initialProps) {
    dataTransfer.setData(DND_PROPS_MIME, JSON.stringify(initialProps))
  }
  dataTransfer.effectAllowed = "move"
}

export function getComponentDragData(dataTransfer: DataTransfer): string | null {
  const type =
    dataTransfer.getData(DND_MIME) || dataTransfer.getData("text/plain")
  return type || null
}

export function getComponentDragProps(
  dataTransfer: DataTransfer,
): Record<string, unknown> | null {
  const raw = dataTransfer.getData(DND_PROPS_MIME)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}
