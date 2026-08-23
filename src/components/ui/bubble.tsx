import * as React from "react"

import { cn } from "@/lib/utils"

function Bubble({
  variant = "received",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "sent" | "received" }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      className={cn(
        "w-fit max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
        variant === "sent"
          ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
          : "mr-auto rounded-bl-md bg-muted text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function BubbleHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-header"
      className={cn("mb-1 flex items-center gap-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function BubbleTimestamp({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="bubble-timestamp"
      className={cn("text-[10px] opacity-70", className)}
      {...props}
    />
  )
}

export { Bubble, BubbleHeader, BubbleTimestamp }
