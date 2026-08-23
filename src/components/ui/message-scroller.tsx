"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function MessageScroller({
  autoScroll = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { autoScroll?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const childCount = React.Children.count(children)

  React.useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight })
    }
  }, [autoScroll, childCount])

  return (
    <div
      ref={ref}
      data-slot="message-scroller"
      className={cn(
        "scrollbar-thin flex max-h-64 flex-col gap-3 overflow-y-auto p-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { MessageScroller }
