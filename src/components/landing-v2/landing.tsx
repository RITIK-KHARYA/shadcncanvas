import { useState } from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CanvasGraph } from "./canvas-graph";
import { Features } from "./features";
import {
  exportSection,
  finalCta,
  flow,
  flowSection,
  footer,
  hero,
  nav,
  product,
  rail,
  stack,
  titleBlock,
} from "./content";

const GITHUB = product.github;

function LogoMark() {
  return (
    <svg viewBox="0 0 26 26" className="size-[26px] shrink-0" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="25"
        height="25"
        rx="6"
        fill="#fff"
        stroke="rgba(20,23,24,0.2)"
      />
      <circle cx="13" cy="13" r="4" className="fill-lp-signal" />
    </svg>
  );
}

function HeroCta({
  tone,
  primary,
  secondary,
  className,
}: {
  tone: "light" | "dark";
  primary: string;
  secondary: string;
  className?: string;
}) {
  const onLight = tone === "light";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button
        asChild
        className={cn(
          "h-11 rounded-lg px-5 text-[14px] font-medium",
          onLight
            ? "bg-lp-ink text-lp-on-ink hover:bg-lp-ink/90"
            : "bg-lp-on-ink text-lp-ink hover:bg-white"
        )}
      >
        <Link to={product.builder}>{primary}</Link>
      </Button>
      <Button
        asChild
        className={cn(
          "h-11 rounded-lg px-5 text-[14px] font-medium has-[>svg]:px-5",
          onLight
            ? "border border-lp-ink/20 bg-white text-lp-ink hover:bg-lp-ink/5"
            : "border border-lp-on-ink/30 bg-transparent text-lp-on-ink hover:bg-lp-on-ink/10"
        )}
      >
        <a href={GITHUB} target="_blank" rel="noreferrer">
          <Github />
          {secondary}
        </a>
      </Button>
    </div>
  );
}

function TopBar() {
  return (
    <header className="lp-grid-bg sticky top-0 z-30 border-b border-lp-hairline px-6 sm:px-16">
      <div className="mx-auto flex w-full max-w-[1312px] items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-lp-ink">
            {product.name}
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden text-[14px] text-lp-ink transition-opacity hover:opacity-60 sm:block"
            >
              {item.label}
            </a>
          ))}
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="hidden text-[14px] text-lp-muted transition-colors hover:text-lp-ink sm:block"
          >
            GitHub
          </a>
          <Button
            asChild
            className="h-10 rounded-lg bg-lp-ink px-4 text-[14px] font-medium text-lp-on-ink hover:bg-lp-ink/90"
          >
            <Link to={product.builder}>{hero.primary}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 px-6 pb-14 pt-16 sm:px-16 sm:pt-20">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[760px]">
            <h1 className="font-display text-[42px] leading-[1.0] font-bold tracking-[-0.04em] text-balance text-lp-ink sm:text-[56px] lg:text-[72px]">
              {hero.headline}
            </h1>
            <p className="mt-7 max-w-[540px] text-[15px] leading-[1.65] text-lp-muted sm:text-[16px]">
              {hero.sub}
            </p>
            <HeroCta
              tone="light"
              primary={hero.primary}
              secondary={hero.secondary}
              className="mt-10"
            />
          </div>

          <div className="w-full shrink-0 border-t border-lp-hairline lg:max-w-[392px]">
            {rail.map((item) => (
              <div
                key={item.ref}
                className="flex gap-4 border-b border-lp-hairline py-4 last:border-b-0"
              >
                <span
                  className={cn(
                    "w-[46px] shrink-0 pt-0.5 font-mono text-[11px]",
                    item.accent ? "text-lp-verdigris" : "text-lp-signal"
                  )}
                >
                  {item.ref}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold text-lp-ink">
                    {item.title}
                  </span>
                  <span className="text-[13px] leading-[1.5] text-lp-muted">
                    {item.body}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CanvasGraph />
      </div>
    </section>
  );
}

function Parts() {
  return (
    <section className="relative z-10 border-y border-lp-hairline">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-stretch px-6 sm:px-16">
        <span className="flex w-[131px] shrink-0 items-center py-4 font-mono text-[13px] text-lp-muted">
          Built with
        </span>
        {stack.map((item) => (
          <span
            key={item}
            className="flex items-center border-l border-lp-hairline px-5 py-4 font-mono text-[13px] text-lp-ink"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function Flow() {
  const step = 1312 / flow.length;
  const center = (index: number) => step * (index + 0.5);

  return (
    <section
      id="flow"
      className="relative z-10 scroll-mt-20 px-6 py-20 sm:px-16 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="font-display max-w-[620px] text-[34px] leading-[1.06] font-bold tracking-[-0.035em] text-lp-ink sm:text-[44px]">
            {flowSection.heading}
          </h2>
          <p className="max-w-[330px] text-[14px] leading-[1.6] text-lp-muted">
            {flowSection.lead}
          </p>
        </div>

        <div className="relative pt-16">
          <svg
            viewBox="0 0 1312 56"
            fill="none"
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden w-full lg:block"
          >
            <line
              x1={center(0)}
              y1="28"
              x2={center(flow.length - 1)}
              y2="28"
              stroke="rgba(20,23,24,0.18)"
            />
            {flow.map((item, index) => (
              <g key={item.title}>
                <circle
                  cx={center(index)}
                  cy="28"
                  r="13"
                  className="fill-lp-panel"
                  stroke="rgba(20,23,24,0.22)"
                />
                <text
                  x={center(index)}
                  y="32.5"
                  textAnchor="middle"
                  className="fill-lp-ink font-mono"
                  style={{ fontSize: 11 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </text>
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
            {flow.map((item, index) => (
              <div key={item.title} className="flex flex-col gap-2 lg:pr-8">
                <span className="font-mono text-[11px] text-lp-signal lg:hidden">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15px] font-semibold text-lp-ink">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-[1.5] text-lp-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Export() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportSection.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="export"
      className="relative z-10 scroll-mt-20 px-6 py-20 sm:px-16 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
        <div className="flex w-full max-w-[420px] shrink-0 flex-col">
          <h2 className="font-display text-[34px] leading-[1.06] font-bold tracking-[-0.035em] text-lp-ink sm:text-[40px]">
            {exportSection.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-lp-muted">
            {exportSection.lead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              onClick={copy}
              className="h-11 rounded-lg bg-lp-ink px-5 text-[14px] font-medium text-lp-on-ink hover:bg-lp-ink/90"
            >
              {copied ? "Copied" : exportSection.primary}
            </Button>
            <Button
              asChild
              className="h-11 rounded-lg border border-lp-ink/20 bg-white px-5 text-[14px] font-medium text-lp-ink hover:bg-lp-ink/5"
            >
              <Link to={product.builder}>{exportSection.secondary}</Link>
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] bg-lp-ink">
          <div className="flex items-center justify-between gap-4 px-7 py-4">
            <span className="font-mono text-[12px] text-lp-signal">
              {exportSection.file}
            </span>
            <span className="font-mono text-[12px] text-lp-on-ink/40">
              {exportSection.meta}
            </span>
          </div>
          <pre className="overflow-x-auto border-t border-lp-on-ink/10 px-7 py-6 font-mono text-[12.5px] leading-[22px] text-lp-on-ink/85">{exportSection.code}</pre>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative z-10 border-t-2 border-lp-signal bg-lp-ink px-6 py-20 sm:px-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col">
        <h2 className="font-display max-w-[820px] text-[36px] leading-[1.04] font-bold tracking-[-0.04em] text-lp-on-ink sm:text-[50px] lg:text-[56px]">
          {finalCta.heading}
        </h2>
        <p className="mt-6 max-w-[520px] text-[15px] leading-[1.65] text-lp-on-ink/55 sm:text-[16px]">
          {finalCta.lead}
        </p>
        <HeroCta
          tone="dark"
          primary={finalCta.primary}
          secondary={finalCta.secondary}
          className="mt-9"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 pb-12 pt-16 sm:px-16 lg:pt-20">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-[420px]">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-lp-ink">
                {product.name}
              </span>
            </div>
            <p className="mt-6 text-[14px] leading-[1.6] text-lp-muted">
              {footer.description}
            </p>
          </div>

          <div className="w-full border-t border-lp-hairline lg:max-w-[424px]">
            {titleBlock.map((entry) => (
              <div
                key={entry.label}
                className="flex items-center justify-between gap-6 border-b border-lp-hairline py-3"
              >
                <span className="font-mono text-[11px] tracking-[0.12em] text-lp-muted uppercase">
                  {entry.label}
                </span>
                <span className="font-mono text-[13px] text-lp-ink">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-[13px] text-lp-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{footer.copyright}</span>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-lp-ink"
          >
            {footer.githubLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}

export function LandingV2() {
  return (
    <>
      {/* Per-route metadata only. Global tags (charset, viewport, keywords,
          author, theme-color, og:image, twitter:card) live in index.html so
          there is exactly one source of truth for each. */}
      <Helmet>
        <title>Shadcn Canvas — Visual Builder for shadcn/ui Components</title>
        <meta name="description" content={product.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://shadcncanvas.vercel.app/" />

        <meta property="og:url" content="https://shadcncanvas.vercel.app/" />
        <meta
          property="og:title"
          content="Shadcn Canvas — Visual Builder for shadcn/ui Components"
        />
        <meta property="og:description" content={product.description} />

        <meta
          name="twitter:title"
          content="Shadcn Canvas — Visual Builder for shadcn/ui Components"
        />
        <meta name="twitter:description" content={product.description} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: product.name,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            url: "https://shadcncanvas.vercel.app/",
            description: product.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Person",
              name: "Ritik Kharya",
              url: "https://github.com/RITIK-KHARYA",
            },
            featureList: [
              "Infinite Canvas with pan/zoom",
              "54+ shadcn/ui components",
              "Live component rendering",
              "Node wiring for logic flow",
              "Prop inspector with real-time updates",
              "Zod schema validation",
              "Code generation export",
              "ZIP export functionality",
              "Theme customization with OKLCH",
              "History management (undo/redo)",
              "Drag & drop component placement",
              "LocalStorage persistence",
            ],
          })}
        </script>
      </Helmet>

      <div className="lp-root">
        <TopBar />
        <main>
          <Hero />
          <Parts />
          <Features />
          <Flow />
          <Export />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
