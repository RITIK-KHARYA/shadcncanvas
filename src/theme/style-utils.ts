export function applyStyleToElement(element: HTMLElement, key: string, value: string): void {
  const currentStyle = element.getAttribute("style") || ""
  const regex = new RegExp(`--${escapeRegExp(key)}\\s*:[^;]+;?\\s*`, "g")
  let cleanedStyle = currentStyle.replace(regex, "").trim()
  if (cleanedStyle && !cleanedStyle.endsWith(";")) {
    cleanedStyle += ";"
  }
  const separator = cleanedStyle ? " " : ""
  element.setAttribute("style", `${cleanedStyle}${separator}--${key}: ${value};`)
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
