import { cn } from "@/lib/utils"

export type SidebarTab = "design" | "prototype" | "comments"

const TABS: { value: SidebarTab; label: string }[] = [
  { value: "design", label: "Design" },
  { value: "prototype", label: "Prototype" },
  { value: "comments", label: "Comments" },
]

export function SidebarTabs({
  value,
  onChange,
}: {
  value: SidebarTab
  onChange: (tab: SidebarTab) => void
}) {
  return (
    <div role="tablist" className="flex shrink-0 border-b px-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative h-9 flex-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground",
            value === tab.value && "text-foreground",
          )}
        >
          {tab.label}
          {value === tab.value && (
            <span className="absolute inset-x-2 -bottom-px h-px bg-foreground" />
          )}
        </button>
      ))}
    </div>
  )
}
