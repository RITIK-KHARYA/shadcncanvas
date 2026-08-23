import * as React from "react"

import { cn } from "@/lib/utils"

function Marker({ className, ...props }: React.ComponentProps<"mark">) {
  return (
    <mark
      data-slot="marker"
      className={cn(
        "rounded-sm bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-500/30",
        className,
      )}
      {...props}
    />
  )
}

export { Marker }
