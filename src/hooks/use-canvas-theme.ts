import { useEffect, useRef } from "react"
import { useEditorStore } from "@/store/editor-store"
import { applyThemeToElement } from "@/theme/apply"

/**
 * Returns a ref for the canvas container and keeps that element's theme
 * variables in sync with the theme editor.
 */
export function useCanvasThemeRef() {
  const containerRef = useRef<HTMLElement>(null)
  const themeState = useEditorStore((s) => s.themeState)

  useEffect(() => {
    if (containerRef.current) {
      applyThemeToElement(themeState, containerRef.current)
    }
  }, [themeState])

  return containerRef
}
