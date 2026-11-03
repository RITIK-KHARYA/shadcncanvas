import type { LucideIcon } from "lucide-react";
import { Check, Layers, Link2 } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  DashboardActivityItem,
  DashboardMixItem,
} from "@/hooks/use-dashboard-data";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  color = "var(--chart-1)",
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-card/70 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline"
          style={{
            color,
            backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
          }}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function Meter({
  label,
  value,
  detail,
  color = "var(--chart-2)",
}: {
  label: string;
  value: number;
  detail?: string;
  color?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-muted-foreground">
          {detail ?? `${clamped}%`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ComponentMixCard({ items }: { items: DashboardMixItem[] }) {
  return (
    <Card className="gap-5 py-5">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">Component mix</CardTitle>
        <CardDescription>
          What the current canvas is built from.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-muted-foreground">
            No components yet. Open the builder and drop a component onto the
            canvas.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {item.count} · {item.share}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(item.share, 3)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const ACTIVITY_ICONS = {
  node: Layers,
  connection: Link2,
  save: Check,
} satisfies Record<DashboardActivityItem["kind"], LucideIcon>;

export function ActivityList({ items }: { items: DashboardActivityItem[] }) {
  return (
    <Card className="gap-5 py-5">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">Recent activity</CardTitle>
        <CardDescription>Everything that shaped this workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-muted-foreground">
            Activity will appear as you build your canvas.
          </p>
        ) : (
          <ol className="space-y-1">
            {items.map((item) => {
              const Icon = ACTIVITY_ICONS[item.kind];
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-hairline bg-surface text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-surface/40 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl border border-hairline bg-card text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
