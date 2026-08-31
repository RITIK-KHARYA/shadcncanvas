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

import type { NodeStyleOverride } from "@/types/graph"

export function nodeStyleToCss(style?: NodeStyleOverride): React.CSSProperties {
  if (!style) return {}
  return {
    borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : undefined,
    borderWidth: style.borderWidth !== undefined ? `${style.borderWidth}px` : undefined,
    borderColor: style.borderColor,
    borderStyle: style.borderStyle && style.borderStyle !== "none" ? style.borderStyle : undefined,
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    fontFamily:
      style.fontFamily && style.fontFamily !== "inherit"
        ? `var(--font-${style.fontFamily})`
        : undefined,
    fontSize: style.fontSize !== undefined ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight,
    padding: style.padding !== undefined ? `${style.padding}px` : undefined,
    opacity: style.opacity !== undefined ? style.opacity / 100 : undefined,
    boxShadow: {
      none: undefined,
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 4px 6px rgba(0,0,0,0.1)",
      lg: "0 10px 15px rgba(0,0,0,0.15)",
    }[style.shadow ?? "none"],
  }
}
