"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Bubble } from "@/components/ui/bubble"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function Message({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message"
      className={cn("flex items-end gap-2", className)}
      {...props}
    />
  )
}

function MessageAvatar({
  name = "A",
  className,
  ...props
}: React.ComponentProps<typeof Avatar> & { name?: string }) {
  return (
    <Avatar className={cn("size-7 shrink-0", className)} {...props}>
      <AvatarFallback className="text-[10px]">{name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

function MessageContent({
  variant = "received",
  children,
  className,
}: {
  variant?: "sent" | "received"
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="message-content"
      data-variant={variant}
      className={cn("flex min-w-0 flex-col gap-1", className)}
    >
      {children}
    </div>
  )
}

function MessageBody({
  variant = "received",
  className,
  ...props
}: React.ComponentProps<"p"> & { variant?: "sent" | "received" }) {
  return (
    <Bubble variant={variant} className={className} {...props} />
  )
}

export { Message, MessageAvatar, MessageContent, MessageBody }
