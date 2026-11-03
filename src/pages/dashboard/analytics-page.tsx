import { Activity, GitBranch, Layers, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ActivityList,
  ComponentMixCard,
  Meter,
  PageHeader,
  StatCard,
} from "@/components/dashboard/dashboard-widgets";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export function AnalyticsPage() {
  const data = useDashboardData();
  const edgeCoverage =
    data.nodes > 1
      ? Math.min(100, Math.round((data.edges / (data.nodes - 1)) * 100))
      : data.edges > 0
        ? 100
        : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="A read-only view of the current canvas: component usage, wiring coverage, and recent workspace activity."
        actions={
          <Button asChild variant="outline">
            <Link to="/app">Open builder</Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Components"
          value={data.nodes}
          hint={`${data.componentMix.length} distinct types`}
          icon={Layers}
          color="var(--chart-1)"
        />
        <StatCard
          label="Wired nodes"
          value={data.wiredNodes}
          hint={`${data.nodes - data.wiredNodes} still isolated`}
          icon={GitBranch}
          color="var(--chart-3)"
        />
        <StatCard
          label="Connections"
          value={data.connections}
          hint={`${data.edges} board edges`}
          icon={Link2}
          color="var(--chart-2)"
        />
        <StatCard
          label="Coverage"
          value={`${data.coverage}%`}
          hint="Nodes with at least one link"
          icon={Activity}
          color="var(--chart-4)"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <ComponentMixCard items={data.componentMix} />

        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Connection health</CardTitle>
            <CardDescription>
              How much of the canvas is connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div
                className="grid size-36 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(var(--chart-2) ${data.coverage * 3.6}deg, var(--surface-strong) ${data.coverage * 3.6}deg)`,
                }}
                role="img"
                aria-label={`${data.coverage}% of nodes are wired`}
              >
                <div className="grid size-28 place-items-center rounded-full bg-card">
                  <div className="text-center">
                    <p className="font-display text-2xl font-semibold">
                      {data.coverage}%
                    </p>
                    <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                      wired
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full min-w-0 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {data.wiredNodes} of {data.nodes} nodes have at least one link.
                </p>
                <Meter
                  label="Canvas completion"
                  value={data.completion}
                  color="var(--chart-1)"
                />
                <Meter
                  label="Edge coverage"
                  value={edgeCoverage}
                  color="var(--chart-4)"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Top components</CardTitle>
            <CardDescription>Ranked by how often they appear.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.componentMix.length === 0 ? (
              <p className="rounded-xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-muted-foreground">
                Component analytics appear once the canvas has nodes.
              </p>
            ) : (
              <ol className="space-y-2">
                {data.componentMix.map((item, index) => (
                  <li
                    key={item.type}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface"
                  >
                    <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.count}
                    </span>
                    <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                      {item.share}%
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <ActivityList items={data.activity} />
      </div>
    </div>
  );
}
