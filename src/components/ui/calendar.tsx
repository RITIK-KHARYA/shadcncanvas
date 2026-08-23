"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background group/calendar p-2", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex flex-col relative gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col relative gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute inset-x-0 top-0 justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--rdp-button-height) p-0 select-none",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--rdp-button-height) p-0 select-none",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--rdp-caption-height) w-full px-8",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "w-full flex items-center justify-center h-(--rdp-caption-height) gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-md border shadow-xs has-focus:border-ring border-input bg-background",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0 appearance-none text-xs",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium text-sm",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md border border-input bg-background pl-2 pr-1 flex h-7 items-center gap-1 text-sm font-medium [&>svg]:size-3.5 [&>svg]:opacity-50",
          defaultClassNames.caption_label,
        ),
        month_grid: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 w-8 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number: cn(
          "text-muted-foreground select-none w-8 text-[0.8rem]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "relative w-8 h-8 text-center text-sm p-0 select-none z-10 rounded-md [&:last-child[data-selected=true]_button]:bg-primary",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:bg-primary"
            : "",
          defaultClassNames.day,
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "up") {
            return <ChevronUpIcon className={cn("size-4", className)} {...props} />
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--rdp-day-height) w-(--rdp-day-width) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-today={modifiers.today || undefined}
      data-outside={modifiers.outside || undefined}
      data-selected={modifiers.selected || undefined}
      className={cn(
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary data-[selected=true]:hover:text-primary-foreground data-[selected=true]:focus:bg-primary data-[selected=true]:focus:text-primary-foreground hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground size-(--rdp-day-height) w-(--rdp-day-width) text-xs font-normal data-[outside=true]:text-muted-foreground aria-selected:opacity-100 [&_svg:not([class*='size-'])]:size-3",
        defaultClassNames.day_button,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
