"use client"

import * as React from "react"
import { Legend as RechartsLegend, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

import { cn } from "@/lib/utils"

type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartStyle({ id }: { id: string }) {
  const { config } = useChart()
  const colorConfig = Object.entries(config).filter(([, item]) => item.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${colorConfig
          .map(([key, item]) => `  --color-${key}: ${item.color};`)
          .join("\n")}\n}`,
      }}
    />
  )
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<typeof ResponsiveContainer>["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        data-slot="chart"
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-pie-tooltip-path]:stroke-border [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

type TooltipPayloadEntry = {
  name?: string | number
  value?: string | number
  color?: string
  fill?: string
  dataKey?: string | number
}

function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel = false,
  formatter,
}: React.ComponentProps<"div"> & {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  hideLabel?: boolean
  formatter?: (value: string | number) => string
}) {
  const { config } = useChart()

  if (!(active && payload?.length)) {
    return null
  }

  return (
    <div
      className={cn(
        "bg-popover text-popover-foreground grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {payload.map((entry, index) => {
        const key = String(entry.dataKey ?? entry.name ?? index)
        const itemLabel = config[key]?.label ?? entry.name
        return (
          <div
            key={key}
            className="flex w-full items-center justify-between gap-2 leading-none"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="size-2.5 shrink-0 rounded-[2px] border"
                style={{
                  backgroundColor: entry.color ?? entry.fill ?? "var(--primary)",
                }}
              />
              <span className="text-muted-foreground">{String(itemLabel ?? key)}</span>
            </span>
            <span className="font-mono font-medium tabular-nums">
              {formatter ? formatter(entry.value ?? 0) : String(entry.value ?? "")}
            </span>
          </div>
        )
      })}
      {!hideLabel && null}
    </div>
  )
}

const ChartTooltip = RechartsTooltip

function ChartLegendContent({
  className,
  payload,
}: React.ComponentProps<"div"> & {
  payload?: TooltipPayloadEntry[]
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 [&_svg]:size-3 [&_svg]:shrink-0",
        className,
      )}
    >
      {payload.map((entry, index) => {
        const key = String(entry.dataKey ?? entry.name ?? index)
        const itemLabel = config[key]?.label ?? entry.name
        return (
          <span key={key} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: entry.color ?? entry.fill ?? "var(--primary)",
              }}
            />
            {String(itemLabel ?? key)}
          </span>
        )
      })}
    </div>
  )
}

const ChartLegend = RechartsLegend

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
}
export type { ChartConfig }
