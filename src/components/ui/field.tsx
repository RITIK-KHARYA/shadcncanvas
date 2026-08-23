"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col [&>*]:w-full md:flex-row md:items-center md:[&>*]:w-auto md:[&>[data-slot=field-label]]:flex-auto",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "flex flex-col gap-0.5 leading-snug",
        className,
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="field-label"
      className={cn(
        "text-foreground text-xs leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]/field:pointer-events-none",
        className,
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-xs leading-none font-medium select-none group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-xs leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=informative]]:*:first:hidden",
        className,
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      className={cn(
        "-my-2 h-2.5 flex items-center gap-2 text-xs whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span className="bg-border line h-px w-full" />
      {children && <span>{children}</span>}
      <span className="bg-border line h-px w-full" />
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = React.useMemo(() => {
    if (React.Children.count(children) > 0) return children
    if (!errors?.length) return null

    if (errors?.length === 1) {
      return errors[0]?.message
    }

    return (
      <ul className="ml-4 list-disc space-y-1">
        {errors.map((error, i) =>
          error?.message ? <li key={i}>{error.message}</li> : null,
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-xs font-normal", className)}
      {...props}
    >
      {content}
    </div>
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3",
        className,
      )}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 border-0 p-0 has-[>[data-slot=field-label]]:border-none",
        className,
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=legend]:text-sm data-[variant=label]:text-xs",
        className,
      )}
      {...props}
    />
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
