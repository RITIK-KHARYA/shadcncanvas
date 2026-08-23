export const DND_MIME = "application/reactflow"

export function setComponentDragData(
  dataTransfer: DataTransfer,
  componentType: string,
) {
  dataTransfer.clearData()
  dataTransfer.setData(DND_MIME, componentType)
  dataTransfer.setData("text/plain", componentType)
  dataTransfer.effectAllowed = "move"
}

export function getComponentDragData(dataTransfer: DataTransfer): string | null {
  const type =
    dataTransfer.getData(DND_MIME) || dataTransfer.getData("text/plain")
  return type || null
}
