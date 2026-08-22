import {
  Box,
  ChevronDown,
  Component,
  Copy,
  Download,
  Redo2,
  Search,
  Undo2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const componentGroups = [
  {
    name: "Layout",
    items: ["Card", "Separator", "Tabs", "Accordion"],
  },
  {
    name: "Form",
    items: ["Button", "Input", "Form", "Select", "Checkbox", "Switch"],
  },
  {
    name: "Feedback",
    items: ["Alert", "Toast", "Progress", "Skeleton"],
  },
  {
    name: "Navigation",
    items: ["Breadcrumb", "Command", "Dropdown Menu", "Navigation Menu"],
  },
]

export function BuilderPage() {
  return (
    <main className="flex h-screen min-h-[720px] flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/60 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Box className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Project name"
            defaultValue="Untitled shadcn canvas"
            className="h-8 max-w-72 border-transparent bg-background/70 font-medium"
          />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Saved locally
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Undo">
            <Undo2 aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Redo">
            <Redo2 aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy aria-hidden="true" />
            Copy Code
          </Button>
          <Button size="sm">
            <Download aria-hidden="true" />
            Export ZIP
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[250px_minmax(540px,1fr)_300px]">
        <aside className="flex min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground">
          <div className="border-b p-4">
            <h1 className="text-sm font-semibold">Components</h1>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                aria-label="Search components"
                placeholder="Search shadcn/ui"
                className="h-8 pl-8"
              />
            </div>
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3">
            {componentGroups.map((group) => (
              <section key={group.name} className="mb-5">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.name}
                  </h2>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </div>
                <div className="grid gap-1.5">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      className="flex h-9 items-center gap-2 rounded-md border bg-background/60 px-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      type="button"
                      draggable
                    >
                      <Component
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="relative min-h-0 overflow-hidden bg-background">
          <div className="canvas-grid absolute inset-0 opacity-35" />
          <div className="absolute left-4 top-4 rounded-md border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-sm">
            React Flow canvas shell
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[340px] rounded-lg border bg-card p-5 text-center shadow-lg">
              <p className="text-sm font-medium">Canvas ready</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Drag-drop nodes, live previews, and wiring begin in the next
                build step.
              </p>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col border-l bg-sidebar text-sidebar-foreground">
          <div className="border-b p-4">
            <h2 className="text-sm font-semibold">Inspector</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a canvas node to edit props.
            </p>
          </div>
          <div className="grid gap-4 p-4">
            <section className="rounded-lg border bg-background/60 p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Props
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                No node selected.
              </p>
            </section>
            <section className="rounded-lg border bg-background/60 p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Theme
              </h3>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {["primary", "secondary", "background", "radius"].map(
                  (token) => (
                    <div
                      key={token}
                      className="h-10 rounded-md border bg-card"
                      title={token}
                    />
                  ),
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
