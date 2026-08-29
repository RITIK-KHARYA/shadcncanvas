import { Link } from "react-router-dom";
import { NodeFlowIllustration } from "@/components/landing/node-flow-illustration";
import { ScrambleText } from "@/components/landing/scramble-text";
import { Marquee } from "@/components/landing/marquee";
import { Button } from "@/components/ui/button";
import { features, stack, steps } from "@/components/landing/constants";
import { ArrowRight, Github } from "lucide-react";

/** Shared horizontal rhythm so every section lines up identically. */
const CONTAINER = "mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-16";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className={`${CONTAINER} flex items-center justify-between py-6`}>
          <span className="font-accent text-sm font-medium tracking-tight">
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
        </div>
      </header>

      {/* Hero — centered */}
      <section className="hero-glow relative">
        <div className={`${CONTAINER} py-24 sm:py-32 lg:py-40`}>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="font-accent mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground uppercase animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/60 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-foreground" />
              </span>
              Client-side · Open source
            </p>

            {/* Expressive, multi-face heading: Montserrat carries the verb,
                Poppins italic carries the accent word — two typefaces,
                two weights, one thought. */}
            <h1 className="flex flex-col items-center gap-1">
              <ScrambleText
                text="Build shadcn UIs"
                className="font-display block text-5xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
              />
              <ScrambleText
                text="— visually."
                revealDelay={260}
                className="font-accent block text-3xl leading-tight font-medium text-muted-foreground italic sm:text-4xl lg:text-5xl"
              />
            </h1>

            <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
              Sketch real shadcn/ui components on an infinite canvas, wire
              behavior between them, validate with Zod, and export
              production-ready React code.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <Button asChild size="lg" className="group">
                <Link to="/app">
                  Start building
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
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

          {/* Product preview — the wiring illustration, framed and centered
              beneath the copy instead of racing it side by side. */}
          <div className="mx-auto mt-20 w-full max-w-2xl rounded-xl border bg-card/40 p-8 shadow-sm sm:mt-24 sm:p-12">
            <NodeFlowIllustration />
          </div>
        </div>

        {/* Stack marquee */}
        <div className="border-y bg-muted/30 py-5">
          <Marquee durationSeconds={22}>
            {stack.map((item) => (
              <span
                key={item}
                className="font-accent shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Features */}
      <section className="border-b">
        <div className={`${CONTAINER} py-24 sm:py-28`}>
          <div className="mx-auto max-w-lg text-center">
            <p className="font-accent text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Features
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Everything the canvas needs
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-background p-7 transition-colors hover:bg-muted/40"
              >
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-md border bg-background transition-transform group-hover:-translate-y-0.5">
                  <feature.icon
                    className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b">
        <div className={`${CONTAINER} py-24 sm:py-28`}>
          <div className="mx-auto max-w-lg text-center">
            <p className="font-accent text-xs font-medium tracking-widest text-muted-foreground uppercase">
              How it works
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Three steps, no boilerplate
            </h2>
          </div>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            <div
              className="absolute top-4 right-0 left-0 hidden h-px bg-border sm:block"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <div key={step.title} className="group relative text-center sm:text-left">
                <span className="relative z-10 inline-flex size-8 items-center justify-center rounded-full border bg-background text-xs font-medium tabular-nums text-muted-foreground transition-colors group-hover:border-foreground group-hover:text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat callout */}
      <section className="border-b bg-muted/30">
        <div className={`${CONTAINER} py-24 text-center sm:py-28`}>
          <ScrambleText
            as="div"
            text="54+ shadcn/ui components"
            className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
            speed={22}
            revealDelay={16}
          />
          <p className="font-accent mt-4 text-sm font-medium text-muted-foreground">
            Fully client-side · nothing to deploy · MIT licensed
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b">
        <div className={`${CONTAINER} flex flex-col items-center gap-4 py-24 text-center sm:py-28`}>
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Start sketching your next UI
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            No account, no config. Open the builder and drag your first
            component onto the canvas.
          </p>
          <Button asChild size="lg" className="mt-3 group">
            <Link to="/app">
              Open Builder
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8">
        <div className={`${CONTAINER} flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between`}>
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