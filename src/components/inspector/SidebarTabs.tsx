import { cn } from "@/lib/utils"

export type SidebarTab = "design" | "effects" | "prototype" | "comments"

const TABS: { value: SidebarTab; label: string }[] = [
  { value: "design", label: "Design" },
  { value: "effects", label: "Effects" },
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
    <div role="tablist" className="shrink-0 border-b border-hairline px-2 py-2">
      <div className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-xl bg-surface p-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={value === tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "h-7 rounded-[calc(var(--radius)-4px)] text-[11px] font-medium text-muted-foreground transition-all",
              value === tab.value && "bg-card text-foreground shadow-sm",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
