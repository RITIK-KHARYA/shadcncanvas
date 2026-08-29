import {
  ArrowLeftRight,
  Braces,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Braces,
    title: "Real shadcn/ui",
    description:
      "Sketch with actual shadcn/ui components — inputs, cards, buttons — not abstract boxes.",
  },
  {
    icon: ArrowLeftRight,
    title: "Wire behavior",
    description:
      "Connect components and map their props the way you would in code.",
  },
  {
    icon: ShieldCheck,
    title: "Validate with Zod",
    description:
      "Schema-validate your component props before you ever export.",
  },
  {
    icon: Workflow,
    title: "Export React",
    description:
      "Generate production-ready React code you can drop straight into your project.",
  },
];

export const stack: string[] = [
  "React",
  "TypeScript",
  "shadcn/ui",
  "Tailwind",
  "Zod",
  "React Router",
  "Vite",
];

export const steps: Step[] = [
  {
    title: "Drag components",
    description:
      "Drop real shadcn/ui components onto an infinite canvas to compose your layout.",
  },
  {
    title: "Wire up props",
    description:
      "Connect state between components and set validated props visually.",
  },
  {
    title: "Export code",
    description:
      "Generate clean, ready-to-use React + TypeScript code and copy it out.",
  },
];
