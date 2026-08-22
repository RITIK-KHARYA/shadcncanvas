import {
  ArrowRight,
  Boxes,
  Cable,
  Code2,
  Github,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    title: "Visual Canvas",
    description:
      "Drop real shadcn/ui components onto an infinite workspace and compose screens by sight.",
    icon: Boxes,
  },
  {
    title: "Logic Wiring",
    description:
      "Connect component handles to model interactions, state flow, and UI behavior before export.",
    icon: Cable,
  },
  {
    title: "Zod Validation",
    description:
      "Describe props and form fields with schemas so generated UI keeps its contracts explicit.",
    icon: ShieldCheck,
  },
  {
    title: "Export as Code",
    description:
      "Copy JSX or download a project structure ready for a shadcn/ui codebase.",
    icon: Code2,
  },
]

const steps = [
  "Drag shadcn components onto the canvas.",
  "Connect logic between nodes with typed wires.",
  "Export clean React code when the design is ready.",
]

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Shadcn Canvas
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl lg:text-6xl">
            Build shadcn UIs visually
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Shadcn Canvas is a visual builder for developers who want to sketch
            real shadcn/ui components, wire behavior, validate forms, and export
            production-friendly React code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/app">
                Start Building
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/RITIK-KHARYA/shadcncanvas"
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {features.map((feature) => (
            <Card key={feature.title} className="rounded-lg bg-card/80">
              <CardHeader>
                <feature.icon
                  className="mb-3 size-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">
              How it works
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A short path from canvas sketch to reusable component code.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <Card key={step} className="rounded-lg">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Shadcn Canvas</span>
          <a
            className="inline-flex items-center gap-2 hover:text-foreground"
            href="https://github.com/RITIK-KHARYA/shadcncanvas"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
