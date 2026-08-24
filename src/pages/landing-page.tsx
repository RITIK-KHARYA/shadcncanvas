import { Link } from "react-router-dom";
import { NodeFlowIllustration } from "@/components/landing/node-flow-illustration";
import { Button } from "@/components/ui/button";
import { features, stack, steps } from "./constant";
import { ArrowRight, Github } from "lucide-react";


export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <span className="text-sm font-medium tracking-tight">
          Shadcn Canvas
        </span>
        <nav className="flex items-center gap-6">
          <a
            href="https://github.com/RITIK-KHARYA/shadcncanvas"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex sm:items-center sm:gap-1.5"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </a>
          <Button asChild size="sm">
            <Link to="/app">Open Builder</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-2 md:items-center md:gap-8 md:py-24 lg:px-10">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-foreground" />
            Client-side · Open source
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            Build shadcn UIs visually
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Sketch real shadcn/ui components on an infinite canvas, wire
            behavior between them, validate with Zod, and export
            production-ready React code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/app">
                Start building
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a
                href="https://github.com/RITIK-KHARYA/shadcncanvas"
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" />
                View source
              </a>
            </Button>
          </div>
        </div>

        <NodeFlowIllustration />
      </section>

      <section className="border-t">
        <div className="mx-auto grid w-full max-w-5xl gap-x-8 gap-y-10 px-6 py-16 sm:px-8 sm:grid-cols-2 lg:px-10 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon
                className="mb-3 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="text-sm font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative pl-0">
                <span className="text-2xl font-semibold tabular-nums text-muted-foreground/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-10 text-xs text-muted-foreground sm:px-8 lg:px-10">
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Built by Ritik Kharya · MIT License</span>
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
  );
}
