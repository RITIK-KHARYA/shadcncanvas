import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { ScrambleText } from "@/components/landing/scramble-text";
import { Button } from "@/components/ui/button";
import { product, stack } from "./content";

import { NodeFlowSVG } from "./node-flow-svg";
import { Features } from "./bento";

const GITHUB = product.github;

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--lp-line)] bg-[var(--lp-bg)]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="lp-tracking-tight text-sm font-semibold">
          {product.name}
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--lp-muted)] transition-colors hover:text-[var(--lp-fg)]"
          >
            <Github className="size-4" /> GitHub
          </a>
          <Button asChild size="sm" className="bg-[var(--lp-fg)] text-[var(--lp-bg)] hover:bg-white">
            <Link to={product.builder}>Open Builder</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-20 pb-10 text-center sm:px-8 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--lp-faint)]"
      >
        <span className="size-1.5 rounded-full bg-[var(--lp-fg)]" />
        {product.tagline}
      </motion.div>

      <ScrambleText
        as="h1"
        text="Build shadcn UIs visually"
        className="lp-tracking-tight mx-auto block text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl"
      />

      <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--lp-muted)]">
        {product.description}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="group bg-[var(--lp-fg)] text-[var(--lp-bg)] hover:bg-white">
          <Link to={product.builder}>
            Open the builder
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="text-[var(--lp-fg)] hover:bg-[var(--lp-glass-hover)]">
          <a href={GITHUB} target="_blank" rel="noreferrer">
            <Github /> View source
          </a>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.1 }}
        className="lp-glass mx-auto mt-16 max-w-xl rounded-3xl p-6 sm:p-8"
      >
        <NodeFlowSVG />
      </motion.div>
    </section>
  );
}

function Tooling() {
  return (
    <section className="relative z-10 border-y border-[var(--lp-line)] bg-[var(--lp-glass)]">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-10 sm:px-8">
        {stack.map((s) => (
          <span
            key={s}
            className="font-mono text-xs uppercase tracking-widest text-[var(--lp-faint)]"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-8">
      <h2 className="lp-tracking-tight text-3xl font-semibold text-balance sm:text-4xl">
        Start sketching your next UI
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--lp-muted)]">
        No account, no config. Open the builder and drag your first component
        onto the canvas.
      </p>
      <Button asChild size="lg" className="group mt-8 bg-[var(--lp-fg)] text-[var(--lp-bg)] hover:bg-white">
        <Link to={product.builder}>
          Open Builder
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--lp-line)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-center text-sm text-[var(--lp-muted)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <span>{product.name} · MIT License</span>
        <a className="inline-flex items-center justify-center gap-2 hover:text-[var(--lp-fg)]" href={GITHUB} target="_blank" rel="noreferrer">
          <Github className="size-4" /> GitHub
        </a>
      </div>
    </footer>
  );
}

export function LandingV2() {
  return (
    <>
      <Helmet>
        <title>Shadcn Canvas — Visual Builder for shadcn/ui Components</title>
        <meta
          name="description"
          content="Drag, wire, and export real shadcn/ui code visually. Build forms, connect logic between components, and download production-ready React."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Shadcn Canvas",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description:
              "Visual builder for shadcn/ui components with logic wiring and code export.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>
      <main className="lp-root">
        <Header />
        <Hero />
        <Tooling />
        <Features />
        <FinalCta />
        <Footer />
      </main>
    </>
  );
}
