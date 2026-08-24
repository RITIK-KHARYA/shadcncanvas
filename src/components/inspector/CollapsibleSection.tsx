import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useInspectorUiStore } from "@/store/inspectorUiStore"
import { cn } from "@/lib/utils"

export function CollapsibleSection({
  id,
  title,
  defaultExpanded = true,
  action,
  children,
}: {
  id: string
  title: string
  defaultExpanded?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const expanded = useInspectorUiStore((s) => s.isExpanded(id, defaultExpanded))
  const toggleSection = useInspectorUiStore((s) => s.toggleSection)

  return (
    <Collapsible
      open={expanded}
      onOpenChange={() => toggleSection(id, defaultExpanded)}
      className="border-t"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-1 text-left focus-visible:outline-none">
          <ChevronRight
            className={cn(
              "size-3 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-90",
            )}
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </span>
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="px-3 pb-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}
