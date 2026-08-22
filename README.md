# shadcn-canvas

Visual node builder for [shadcn/ui](https://ui.shadcn.com) components. Drag components onto a canvas, wire them together, preview live behavior, tweak theme tokens, and export JSX.

## Features

- **Canvas** — React Flow pan/zoom, snap-to-grid, dark theme preview
- **13 node types** — Button, Input, Textarea, Checkbox, Switch, Select, Label, Form, Card, Badge, Tabs, Separator, Skeleton
- **Wiring** — Type-checked edges, transforms (passthrough / invert / negate), live state propagation
- **Inspector** — Auto-generated props, form field editor, select options, node sizing (default / custom)
- **Theme panel** — Edit primary, secondary, background, radius on canvas
- **Copy Code** — Clipboard export as React JSX
- **Export ZIP** — `GeneratedComponent.tsx`, `graph.json`, `theme.json`
- **Persistence** — Auto-save to `localStorage`
- **Undo / Redo** — History stack for canvas edits

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) → **Open Builder** → `/app`

## Wiring example

1. Drop **Button** and **Form**
2. Connect Button `pressed` → Form `active`
3. Click the button — form field enables/disables in real time

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | Oxlint |

## Project structure

```
src/
├── components/canvas/     React Flow + BaseNode + NodePreview
├── components/inspector/  Props, edges, theme, form fields
├── components/sidebar/    Draggable component library
├── lib/                   codegen, nodeRegistry, nodeSchemas, persistence
├── store/                 graphStore (nodes/edges/history), themeStore
└── pages/                 landing-page, builder-page
```

## Tech stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · @xyflow/react · Zustand · Zod · shadcn/ui

## License

MIT
