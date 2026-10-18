import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CodeXml,
  LayoutGrid,
  PanelTop,
  ShieldCheck,
  SlidersHorizontal,
  Spline,
} from "lucide-react";

export const product = {
  name: "Shadcn Canvas",
  tagline: "Visual builder for shadcn/ui",
  description:
    "Place real shadcn/ui components on an infinite canvas, connect how they behave, and generate production-ready React. No proprietary lock-in.",
  github: "https://github.com/RITIK-KHARYA/shadcncanvas",
  builder: "/auth",
};

export const hero = {
  headline: "Drag shadcn components. Wire the logic. Export real React.",
  sub: product.description,
  primary: "Open the builder",
  secondary: "View source",
};

export interface RailItem {
  ref: string;
  title: string;
  body: string;
  accent?: boolean;
}

/* The only three things the product actually does, in order. */
export const rail: RailItem[] = [
  {
    ref: "N01",
    title: "Components",
    body: "54 shadcn/ui blocks, live-rendered on the canvas.",
  },
  {
    ref: "N02",
    title: "Wiring",
    body: "Typed edges route state and events between them.",
  },
  {
    ref: "N03",
    title: "Export",
    body: "Production React, or a ZIP with your theme.",
    accent: true,
  },
];

export const stack: string[] = [
  "React 19",
  "TypeScript",
  "React Flow",
  "shadcn/ui",
  "Tailwind 4",
  "Zustand",
  "React Hook Form",
  "Zod",
];

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const featuresSection = {
  heading: "Everything you need, on one canvas",
  lead: "Every shadcn/ui primitive, wired to real behavior, so you can focus on the interface instead of the tooling.",
  includedLabel: "Also included",
};

/* The one capability worth a full-width row, then the spec sheet. */
export const featuredFeature: Feature = {
  title: "Infinite canvas",
  description:
    "Pan and zoom a React Flow canvas. Sketch freely, rearrange without page limits, and keep every screen in one place.",
  icon: PanelTop,
};

export const features: Feature[] = [
  {
    title: "54 real components",
    description:
      "Layout, form, feedback, navigation and data blocks, dropped in as actual components.",
    icon: LayoutGrid,
  },
  {
    title: "Node wiring",
    description:
      "Connect components with typed edges, so state and events flow where you mean them to.",
    icon: Spline,
  },
  {
    title: "Validated with Zod",
    description:
      "Schema-check every prop with react-hook-form before you export a single line.",
    icon: ShieldCheck,
  },
  {
    title: "Live inspector",
    description:
      "Edit props and theme tokens in a live inspector, backed by OKLCH color tokens.",
    icon: SlidersHorizontal,
  },
  {
    title: "JSX and ZIP export",
    description:
      "Copy production-ready JSX, or download a ZIP with your graph, theme tokens and scaffolding.",
    icon: CodeXml,
  },
  {
    title: "Try it right now",
    description:
      "Runs entirely in your browser. Open the builder and drag your first component onto the canvas.",
    icon: ArrowRight,
  },
];

export const alsoIncluded: string[] = [
  "Undo, redo and full edit history",
  "Auto-save to localStorage",
  "Dark mode with OKLCH tokens",
  "Typed edges for every connection",
];

export const flowSection = {
  heading: "From first search to shipped code",
  lead: "Six steps stand between an empty canvas and a React component in your own project.",
};

export interface FlowStep {
  title: string;
  body: string;
}

export const flow: FlowStep[] = [
  { title: "Search", body: "Find a component in the palette by keyword." },
  { title: "Drag", body: "Drop it onto the canvas as a React Flow node." },
  { title: "Wire", body: "Connect nodes with typed edges." },
  { title: "Configure", body: "Edit props in the live inspector." },
  { title: "Validate", body: "Run Zod schemas against the data." },
  { title: "Export", body: "Copy the JSX, or download a ZIP." },
];

export const exportSection = {
  heading: "Export real React, not a screenshot",
  lead: "Every node becomes JSX with its props, state and wired events intact. Drop it straight into your project, or download the whole thing with your theme tokens.",
  primary: "Copy JSX",
  secondary: "Download ZIP",
  file: "Form.tsx",
  meta: "React + TypeScript",
  code: `import { Button, Input } from "@/components/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function Form() {
  const form = useForm({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Email" {...form.register("email")} />
      <Button type="submit">Create account</Button>
    </form>
  )
}`,
};

export const finalCta = {
  heading: "Open the builder and drag your first component.",
  lead: "No setup and nothing to deploy. The canvas runs entirely in your browser and exports as plain React you already own.",
  primary: "Open the builder",
  secondary: "View source",
};

export const footer = {
  description:
    "A visual canvas for shadcn/ui. Drag real components, wire their behavior, and export React you own.",
  copyright: "\u00a9 2026 Shadcn Canvas",
  githubLabel: "View source on GitHub",
};

export interface TitleBlockEntry {
  label: string;
  value: string;
}

/* An engineering title block, not a link farm. */
export const titleBlock: TitleBlockEntry[] = [
  { label: "Project", value: "Shadcn Canvas" },
  { label: "Revision", value: "2.0" },
  { label: "License", value: "MIT" },
  { label: "Author", value: "Ritik Kharya" },
];

export const nav = [
  { label: "Features", href: "#features" },
  { label: "Flow", href: "#flow" },
  { label: "Export", href: "#export" },
];
