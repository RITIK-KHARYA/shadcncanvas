"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const itemVariants = cva(
  "group/item flex items-center border border-transparent w-full text-sm rounded-md transition-colors hover:bg-accent [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none [&_svg:not([class*='size-'])]:size-4 flex-wrap outline-none has-[>[data-slot=item-actions]]:items-center",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50 border-transparent",
      },
      size: {
        default: "gap-2.5 p-2.5",
        sm: "gap-2 p-2",
        xs: "gap-1 p-1.5 rounded-[calc(var(--radius)-2px)] [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex w-full flex-col gap-4", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-2", className)}
      {...props}
    />
  )
}

function Item({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      data-size={size}
      role="listitem"
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "icon" | "image"
}) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "flex shrink-0 items-center justify-center gap-2 group-has-[>[data-slot=item-description]]/item:self-start [&_svg:not([class*='size-'])]:size-4",
        variant === "icon" &&
          "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        variant === "image" &&
          "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
        variant === "default" && "bg-transparent self-center",
        className,
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5",
        className,
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex min-w-0 items-center gap-2 text-xs leading-none font-medium whitespace-nowrap",
        className,
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-muted-foreground line-clamp-2 text-xs leading-normal font-normal text-balance",
        className,
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2 min-w-0 text-muted-foreground text-[10px] uppercase font-medium tracking-wide",
        className,
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2 min-w-0 text-xs",
        className,
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemGroup,
  itemVariants,
}
