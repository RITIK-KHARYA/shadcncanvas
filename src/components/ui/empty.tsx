import * as React from "react"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-balance",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-0.5 text-center", className)}
      {...props}
    />
  )
}

function EmptyMedia({
  variant = "icon",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "icon" | "default" }) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center mb-2",
        variant === "icon" &&
          "bg-muted text-foreground flex size-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
        variant === "default" && "mb-0",
        className,
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground text-xs leading-relaxed",
        className,
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-sm text-balance",
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
}
