import {
  Activity,
  ArrowRight,
  Check,
  FolderOpen,
  GitBranch,
  Layers,
  Link2,
  Settings,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
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
  EmptyState,
  Meter,
  PageHeader,
  StatCard,
} from "@/components/dashboard/dashboard-widgets";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { authClient } from "@/lib/auth-client";
import { formatRelativeTime, greetingForHour } from "@/lib/dashboard";

const QUICK_ACTIONS = [
  {
    to: "/app",
    label: "Open the builder",
    detail: "Drag components and wire logic",
    icon: Layers,
  },
  {
    to: "/dashboard/projects",
    label: "Browse projects",
    detail: "Open your workspace or a template",
    icon: FolderOpen,
  },
  {
    to: "/dashboard/analytics",
    label: "Review analytics",
    detail: "See component and wiring coverage",
    icon: Activity,
  },
  {
    to: "/dashboard/settings",
    label: "Account settings",
    detail: "Profile, appearance, and session",
    icon: Settings,
  },
] as const;

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface/60 px-3 py-2.5">
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

export function OverviewPage() {
  const data = useDashboardData();
  const { data: session } = authClient.useSession();
  const firstName =
    session?.user?.name?.trim().split(/\s+/)[0] ||
    session?.user?.email?.split("@")[0] ||
    "builder";
  const savedLabel = formatRelativeTime(data.lastSaved);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greetingForHour()}, ${firstName}`}
        description={
          data.hasContent
            ? "Your workspace is warmed up. Pick up where you left off or review how the canvas is wired."
            : "Your dashboard is ready. Open the builder to create your first component graph."
        }
        actions={
          <>
            <Button asChild>
              <Link to="/app">
                Open builder
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/projects">Projects</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Components"
          value={data.nodes}
          hint={`${data.wiredNodes} wired to another node`}
          icon={Layers}
          color="var(--chart-1)"
        />
        <StatCard
          label="Connections"
          value={data.connections}
          hint={`${data.edges} edges on the board`}
          icon={Link2}
          color="var(--chart-2)"
        />
        <StatCard
          label="Coverage"
          value={`${data.coverage}%`}
          hint="Nodes with at least one link"
          icon={GitBranch}
          color="var(--chart-3)"
        />
        <StatCard
          label="Workspace"
          value={data.hasContent ? "Active" : "Empty"}
          hint={data.hasContent ? `Saved ${savedLabel.toLowerCase()}` : "Waiting for a first component"}
          icon={Check}
          color="var(--chart-4)"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Current workspace</CardTitle>
                <CardDescription>
                  The canvas that will open in the builder.
                </CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {data.editorMode}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.hasContent ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl font-semibold tracking-[-0.02em]">
                      {data.projectName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last saved {savedLabel.toLowerCase()}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/dashboard/projects">View project</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <MiniMetric label="Nodes" value={data.nodes} />
                  <MiniMetric label="Edges" value={data.edges} />
                  <MiniMetric label="Links" value={data.connections} />
                </div>

                <div className="space-y-3">
                  <Meter
                    label="Canvas completion"
                    value={data.completion}
                    color="var(--chart-1)"
                  />
                  <Meter
                    label="Nodes wired"
                    value={data.coverage}
                    detail={`${data.wiredNodes}/${data.nodes}`}
                    color="var(--chart-2)"
                  />
                </div>
              </>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Your canvas is empty"
                description="Open the builder and drop your first component. The dashboard updates as soon as the canvas has content."
                action={
                  <Button asChild size="sm">
                    <Link to="/app">
                      Open builder
                      <ArrowRight />
                    </Link>
                  </Button>
                }
                className="border-0 bg-transparent py-6"
              />
            )}
          </CardContent>
        </Card>

        <Card className="gap-3 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CardDescription>Move through the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline bg-surface text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {action.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {action.detail}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ComponentMixCard items={data.componentMix} />
        <ActivityList items={data.activity} />
      </div>
    </div>
  );
}
