import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CodeXml,
  GitFork,
  Infinity as InfinityIcon,
  PencilRuler,
  ShieldCheck,
} from "lucide-react";

export const product = {
  name: "Shadcn Canvas",
  tagline: "Visual builder for shadcn/ui",
  description:
    "Drag real shadcn/ui components onto an infinite canvas, wire their behavior, validate with Zod, and export production-ready React code. Fully client-side — nothing to deploy.",
  github: "https://github.com/RITIK-KHARYA/shadcncanvas",
  builder: "/auth",
};

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    title: "Infinite canvas",
    description:
      "Pan and zoom a React Flow canvas. Sketch and rearrange freely, no page limits.",
    icon: InfinityIcon,
  },
  {
    title: "54+ real components",
    description:
      "Drop actual shadcn/ui components — layout, form, feedback, navigation and more.",
    icon: Boxes,
  },
  {
    title: "Node wiring",
    description:
      "Connect nodes with typed edges to route state and events between components.",
    icon: GitFork,
  },
  {
    title: "Validated with Zod",
    description:
      "Schema-validate component props with react-hook-form before you ever export.",
    icon: ShieldCheck,
  },
  {
    title: "Live inspector",
    description:
      "Edit props and theme tokens in a live inspector with OKLCH color tokens.",
    icon: PencilRuler,
  },
  {
    title: "JSX + ZIP export",
    description:
      "Generate production-ready React JSX, or download a ZIP with your graph and theme.",
    icon: CodeXml,
  },
];

export const flow: string[] = [
  "Search",
  "Drag",
  "Wire",
  "Configure",
  "Validate",
  "Export",
];

export const stack: string[] = [
  "React 19",
  "TypeScript",
  "Vite",
  "React Flow",
  "shadcn/ui",
  "Radix UI",
  "Tailwind 4",
  "Zustand",
  "React Hook Form",
  "Zod",
];
