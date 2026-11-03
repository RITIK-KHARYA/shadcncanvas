import {
  ArrowRight,
  FolderOpen,
  HardDrive,
  LayoutTemplate,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState, PageHeader } from "@/components/dashboard/dashboard-widgets";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { formatRelativeTime } from "@/lib/dashboard";
import {
  buildTemplateGraph,
  DASHBOARD_TEMPLATES,
  type DashboardTemplate,
} from "@/lib/dashboard-templates";
import { saveProject } from "@/lib/persistence";
import { useGraphStore } from "@/store/graph-store";
import { useThemeModeStore } from "@/store/theme-mode-store";

type PendingProject = {
  name: string;
  template: DashboardTemplate | null;
};

export function ProjectsPage() {
  const data = useDashboardData();
  const navigate = useNavigate();
  const mode = useThemeModeStore((state) => state.mode);
  const [pending, setPending] = useState<PendingProject | null>(null);

  const createProject = () => {
    if (!pending) return;

    const template = pending.template;
    const { nodes, edges } = template
      ? buildTemplateGraph(template)
      : { nodes: [], edges: [] };
    const graph = useGraphStore.getState();

    // A project starts from a clean connection list. The builder rehydrates
    // nodes and edges from the saved snapshot when it mounts.
    useGraphStore.setState({ connections: [] });
    graph.hydrate(nodes, edges);

    if (template) {
      for (const link of template.links) {
        graph.addConnection({
          sourceId: template.components[link.source].type,
          sourcePort: link.sourcePort,
          targetId: template.components[link.target].type,
          targetPort: link.targetPort,
          sourceNodeId: nodes[link.source].id,
          targetNodeId: nodes[link.target].id,
        });
      }
    }

    saveProject({
      projectName: pending.name,
      mode,
      editorMode: "board",
      board: { nodes, edges },
      design: null,
    });

    toast.success(template ? `${template.name} loaded` : "Blank project ready");
    setPending(null);
    navigate("/app");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Open the current canvas, start a blank project, or load a template to get moving quickly."
        actions={
          <>
            <Button asChild>
              <Link to="/app">
                Open builder
                <ArrowRight />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setPending({ name: "Untitled canvas", template: null })}
            >
              <Plus />
              New blank project
            </Button>
          </>
        }
      />

      <section aria-labelledby="current-project-heading" className="space-y-3">
        <h2
          id="current-project-heading"
          className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
        >
          Current project
        </h2>

        {data.hasContent || data.savedProject ? (
          <Card className="gap-5 py-5">
            <CardHeader className="pb-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderOpen className="size-4 text-muted-foreground" />
                    <span className="truncate">{data.projectName}</span>
                  </CardTitle>
                  <CardDescription>
                    Saved {formatRelativeTime(data.lastSaved).toLowerCase()} ·{" "}
                    {data.nodes} components · {data.edges} edges
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {data.editorMode}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Button asChild size="sm">
                <Link to="/app">
                  Open builder
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard/analytics">View analytics</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/dashboard">Back to overview</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No saved project yet"
            description="Create a blank project or start from one of the templates below. Projects are stored locally in this browser."
            action={
              <Button
                size="sm"
                onClick={() =>
                  setPending({ name: "Untitled canvas", template: null })
                }
              >
                <Plus />
                New blank project
              </Button>
            }
          />
        )}
      </section>

      <section aria-labelledby="templates-heading" className="space-y-3">
        <div>
          <h2
            id="templates-heading"
            className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
          >
            Templates
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading a template replaces the canvas saved in this browser.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {DASHBOARD_TEMPLATES.map((template) => (
            <Card key={template.id} className="gap-4 py-5">
              <CardHeader className="pb-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-xl border border-hairline bg-surface text-muted-foreground">
                    <LayoutTemplate className="size-4" aria-hidden="true" />
                  </span>
                  <Badge variant="outline">{template.tag}</Badge>
                </div>
                <CardTitle className="mt-2 text-base">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {template.components.length} components
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPending({ name: template.name, template })
                  }
                >
                  Load template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-surface/40 p-4">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-hairline bg-card text-muted-foreground">
          <HardDrive className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium">Stored locally</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Your canvas is saved automatically in this browser. Signing in keeps
            access gated, while the project itself stays on this device.
          </p>
        </div>
      </div>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending?.template
                ? `Load “${pending.template.name}”?`
                : "Start a blank project?"}
            </DialogTitle>
            <DialogDescription>
              This replaces the canvas currently saved in this browser. You can
              still undo changes inside the builder after it opens.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button onClick={createProject}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
