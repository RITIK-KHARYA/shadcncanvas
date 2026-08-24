
import {
  Boxes,
  Cable,
  Code2,
  ShieldCheck,
} from "lucide-react";


export const features = [
  {
    title: "Visual canvas",
    description:
      "Drop real shadcn/ui components onto an infinite workspace and compose screens by sight.",
    icon: Boxes,
  },
  {
    title: "Logic wiring",
    description:
      "Connect component handles to model interactions, state flow, and UI behavior before export.",
    icon: Cable,
  },
  {
    title: "Zod validation",
    description:
      "Describe props and form fields with schemas so generated UI keeps its contracts explicit.",
    icon: ShieldCheck,
  },
  {
    title: "Export as code",
    description:
      "Copy JSX or download a project structure ready for a shadcn/ui codebase.",
    icon: Code2,
  },
];

export const steps = [
  {
    title: "Drag",
    description: "Place shadcn components onto the canvas.",
  },
  {
    title: "Wire",
    description: "Connect logic between nodes with typed edges.",
  },
  {
    title: "Export",
    description: "Generate clean React code when the design is ready.",
  },
];

export const stack = [
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "Zustand",
  "React Hook Form",
  "Zod",
  "React Flow",
];