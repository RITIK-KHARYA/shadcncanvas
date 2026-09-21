import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ScrambleText } from "@/components/landing/scramble-text";
import { Button } from "@/components/ui/button";
import { AeroShards } from "@/components/AeroShards.jsx";
import GradientWaves from "@/components/GradientWaves.jsx";

import { product, stack } from "./content";

import { NodeFlowSVG } from "./node-flow-svg";
import { Features } from "./bento";
import { ScrollArea } from "../ui/scroll-area";

const GITHUB = product.github;

function Hero() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="absolute inset-0">
        <AeroShards
          backgroundColor="#120F17"
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={1}
          spin={1}
          interaction="repel"
          density={1.5}
          shardSize={1.1}
          stretch={1}
          turbulence={1}
          glow={1}
          edgeSoftness={2}
          bloom={0.5}
          grain={0.05}
          chromaticAberration={0.0075}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather
          paused={false}
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-20 pb-10 text-center sm:px-8 sm:pt-28">
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
          <Button
            asChild
            size="lg"
            className="group bg-[var(--lp-fg)] text-[var(--lp-bg)] hover:bg-white"
          >
            <Link to={product.builder}>
              Open the builder
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="text-[var(--lp-fg)] hover:bg-[var(--lp-glass-hover)]"
          >
            <a href={GITHUB} target="_blank" rel="noreferrer">
              <Github /> View source
            </a>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 26,
            delay: 0.1,
          }}
          className="lp-glass mx-auto mt-16 max-w-xl rounded-3xl p-6 sm:p-8"
        >
          <NodeFlowSVG />
        </motion.div>
      </div>
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
      <Button
        asChild
        size="lg"
        className="group mt-8 bg-[var(--lp-fg)] text-[var(--lp-bg)] hover:bg-white"
      >
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
    <footer className="relative z-10 overflow-hidden border-t border-[var(--lp-line)]">
      <div className="lp-waves absolute inset-0" aria-hidden="true">
        <GradientWaves
          horizonColor="#120F17"
          waveColor="#896ABD"
          crestColor="#A855F7"
          speed={0.55}
          amplitude={2}
          waveScale={0.55}
          waveRatio={0.85}
          swell={30}
          turbulence={18}
          tilt={1.1}
          zoom={1.05}
          height={13.5}
          fogDepth={14}
          detail="medium"
          brightness={0.9}
          opacity={0.5}
          mouseInteraction
          parallaxStrength={0.3}
          grain
          grainIntensity={0.06}
        />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16 text-center text-sm text-[var(--lp-muted)] sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:text-left">
        <div className="flex flex-col gap-1.5">
          <span className="lp-mono-label">{product.tagline}</span>
          <span className="flex flex-col gap-0.5">
            <span className="lp-tracking-tight text-base font-semibold text-[var(--lp-fg)]">
              {product.name}
            </span>
            <span>MIT License · build, wire, export.</span>
          </span>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 hover:text-[var(--lp-fg)]"
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
        >
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
      <ScrollArea className="h-screen">
        <main className="lp-root">
          <Hero />
          <Tooling />
          <Features />
          <FinalCta />
          <Footer />
        </main>
      </ScrollArea>
    </>
  );
}
