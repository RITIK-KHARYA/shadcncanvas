import * as React from "react"

import { cn } from "@/lib/utils"

function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div
      data-slot="native-select-wrapper"
      className="relative flex w-fit items-center"
    >
      <select
        data-slot="native-select"
        className={cn(
          "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full min-w-0 appearance-none items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground pointer-events-none absolute right-3.5 size-4"
      >
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
    </div>
  )
}

export { NativeSelect }
