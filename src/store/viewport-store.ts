import { create } from "zustand"

/**
 * Camera transform for the design canvas: zoom level plus pan offset in screen
 * pixels. World-to-screen conversion is `screen = world * zoom + pan`.
 */

type ViewportStore = {
  zoom: number
  panX: number
  panY: number
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  reset: () => void
}

export const MIN_ZOOM = 0.05
export const MAX_ZOOM = 8

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

export const useViewportStore = create<ViewportStore>((set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  setPan: (panX, panY) => set({ panX, panY }),
  reset: () => set({ zoom: 1, panX: 0, panY: 0 }),
}))
