import { create } from "zustand"

type InspectorUiStore = {
  expandedSections: Record<string, boolean>
  toggleSection: (id: string, defaultExpanded?: boolean) => void
  isExpanded: (id: string, defaultExpanded?: boolean) => boolean
}

/** Remembers collapsed/expanded state of inspector sections across selection changes. */
export const useInspectorUiStore = create<InspectorUiStore>((set, get) => ({
  expandedSections: {},

  toggleSection: (id, defaultExpanded = true) => {
    const current = get().isExpanded(id, defaultExpanded)
    set({ expandedSections: { ...get().expandedSections, [id]: !current } })
  },

  isExpanded: (id, defaultExpanded = true) => {
    const value = get().expandedSections[id]
    return value === undefined ? defaultExpanded : value
  },
}))
