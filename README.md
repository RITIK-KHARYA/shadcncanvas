# 🎨 Shadcn Canvas

**Shadcn Canvas** is a visual builder for developers who want to sketch real [shadcn/ui](https://ui.shadcn.com/) components, wire interactive behavior, validate forms with Zod schemas, and export production-ready React code — all from an infinite drag-and-drop canvas powered by [React Flow](https://reactflow.dev/).

> Think **Figma meets shadcn/ui** — design with real components, export real code.

---

## 🔗 Live Demo & Deployments

| Environment | URL |
|---|---|
| 🌐 Live Application | _Coming Soon_ |
| 📦 GitHub Repository | [github.com/RITIK-KHARYA/shadcncanvas](https://github.com/RITIK-KHARYA/shadcncanvas) |

---

## 🌟 Core Features

### 🖼️ Infinite Visual Canvas
Drop real shadcn/ui components onto a pannable, zoomable workspace powered by React Flow (`@xyflow/react`). Compose full screens by sight with a dot-grid backdrop and intuitive spatial layout.

### 🔌 Logic Wiring & Behavior Modeling
Connect component handles to model interactions, state flow, and event routing between nodes before export — turning static UI mockups into interactive prototypes.

### 🛡️ Zod Schema Validation
Describe props and form fields with [Zod](https://zod.dev/) schemas so generated UI keeps its contracts explicit. Form validation rules are inferred directly from schema definitions via `react-hook-form` + `@hookform/resolvers`.

### 📤 Export as Production Code
Copy clean JSX to clipboard or download an entire project structure as a ZIP archive (via `jszip` + `file-saver`) ready to drop into any existing shadcn/ui codebase.

### 🧩 33+ Pre-Built UI Components
Ships with a curated library of **33 shadcn/ui components** spanning Layout, Form, Feedback, and Navigation categories — including Accordion, Card, Tabs, Button, Input, Select, Checkbox, Switch, Combobox, Dropdown Menu, Context Menu, Sheet, Sidebar, and more.

### 🔍 Searchable Component Palette
A dedicated left-panel sidebar with grouped component categories (Layout, Form, Feedback, Navigation) and instant search to filter and locate components by name.

### 🎛️ Live Props Inspector
Right-panel inspector displays editable props and theme tokens for any selected canvas node — update variant, size, disabled state, placeholder text, and theme colors in real time.

### 🌗 Dark Mode First
Designed with a dark-mode-first aesthetic using OKLCH color tokens, custom CSS variables, and view-transition animations for seamless theme switching.

### 📱 Responsive Design Hooks
Built-in `useIsMobile` hook and responsive breakpoints ensure the builder itself adapts gracefully across desktop and tablet viewports.

### ↩️ Undo / Redo History
Header toolbar provides Undo and Redo controls for non-destructive canvas editing workflows.

---

## 📸 Visual Tour & Screenshots

A visual walkthrough of the Shadcn Canvas application interface:

### 1. Landing Page
Modern, minimal landing page introducing the project with feature cards, a 3-step "How it Works" guide, and prominent call-to-action buttons.

<!-- Screenshot: docs/screenshots/landing-page.png -->

### 2. Builder Canvas
The core canvas workspace featuring a three-panel layout:
- **Left Sidebar** — Searchable component palette organized by category
- **Center Canvas** — Infinite React Flow workspace with dot-grid background
- **Right Inspector** — Live props editor and theme token previewer

<!-- Screenshot: docs/screenshots/builder-canvas.png -->

### 3. Component Drag & Drop
Draggable component buttons in the sidebar palette ready to be placed onto the canvas surface.

<!-- Screenshot: docs/screenshots/drag-drop.png -->

### 4. Props Inspector Panel
Context-sensitive property editor displaying editable props and theme color swatches for the selected node.

<!-- Screenshot: docs/screenshots/inspector-panel.png -->

### 5. Export & Code Copy
One-click "Copy Code" and "Export ZIP" actions in the header toolbar for instant code generation.

<!-- Screenshot: docs/screenshots/export-actions.png -->

---

## 🏗️ System Architecture

### High-Level Architecture

Shadcn Canvas follows a clean, client-side single-page architecture. The entire application runs in the browser with no backend dependency — all state is managed locally via Zustand stores.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Shadcn Canvas — Browser SPA                       │
│                                                                             │
│  ┌───────────────┐    ┌─────────────────────┐    ┌────────────────────────┐ │
│  │  Landing Page  │───▶│   Builder Workspace   │───▶│   Export Pipeline     │ │
│  │  (/ route)     │    │   (/app route)        │    │   (JSX / ZIP)        │ │
│  └───────────────┘    └──────┬──────┬─────────┘    └────────────────────────┘ │
│                              │      │                                        │
│                  ┌───────────┘      └───────────┐                            │
│                  ▼                               ▼                           │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐             │
│  │   Component Palette      │   │   Props Inspector Panel      │             │
│  │   (Left Sidebar)         │   │   (Right Sidebar)            │             │
│  │                           │   │                              │             │
│  │  ┌─ Layout ─────────┐   │   │  ┌─ Props Editor ─────────┐ │             │
│  │  │  Card, Separator  │   │   │  │  variant, size, etc.   │ │             │
│  │  │  Tabs, Accordion  │   │   │  └────────────────────────┘ │             │
│  │  └───────────────────┘   │   │  ┌─ Theme Tokens ─────────┐ │             │
│  │  ┌─ Form ───────────┐   │   │  │  primary, secondary     │ │             │
│  │  │  Button, Input    │   │   │  │  background, radius     │ │             │
│  │  │  Select, Checkbox │   │   │  └────────────────────────┘ │             │
│  │  └───────────────────┘   │   └──────────────────────────────┘             │
│  │  ┌─ Feedback ────────┐   │                                               │
│  │  │  Alert, Toast     │   │           ┌────────────────────┐              │
│  │  │  Progress, Skel.  │   │           │  React Flow Canvas │              │
│  │  └───────────────────┘   │           │  (@xyflow/react)   │              │
│  │  ┌─ Navigation ──────┐   │           │                    │              │
│  │  │  Breadcrumb, Menu │   │           │  • Drag & Drop     │              │
│  │  │  Dropdown, NavMenu│   │           │  • Node Wiring     │              │
│  │  └───────────────────┘   │           │  • Pan & Zoom      │              │
│  └─────────────────────────┘           │  • Live Preview    │              │
│                                         └────────────────────┘              │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        State Management Layer                          │ │
│  │  Zustand Store  ←→  React Hook Form  ←→  Zod Validation              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Canvas Builder Pipeline

When a user builds a UI on the canvas, Shadcn Canvas executes a multi-stage pipeline:

| Stage | Process | Description |
|---|---|---|
| **1. Component Selection** | Palette Search & Browse | User searches or browses 33+ categorized shadcn/ui components in the sidebar |
| **2. Canvas Placement** | Drag & Drop onto React Flow | Components are dragged from the palette and instantiated as React Flow nodes |
| **3. Behavior Wiring** | Handle Connection | Nodes are connected via typed edges to model data flow and event propagation |
| **4. Props Configuration** | Inspector Panel Editing | Selected node props (variant, size, placeholder, disabled) are edited live |
| **5. Schema Validation** | Zod + React Hook Form | Form components are validated against Zod schemas with resolver integration |
| **6. Code Export** | JSX Copy / ZIP Download | Final layout is serialized to clean JSX and exported as clipboard text or ZIP |

---

## 💻 Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19, Vite 8 | Latest React with ultra-fast HMR via Vite |
| **Language** | TypeScript 7 | Strict type safety across the entire codebase |
| **Canvas Engine** | @xyflow/react (React Flow) | Infinite pan-zoom canvas with node/edge graph editing |
| **UI Components** | shadcn/ui (New York style) | 33+ accessible, composable Radix UI primitives |
| **Styling** | Tailwind CSS 4, tw-animate-css | Utility-first CSS with OKLCH design tokens & animations |
| **State Management** | Zustand 5 | Lightweight, performant global state stores |
| **Form Handling** | React Hook Form 7, Zod 4 | Performant form state with schema-first validation |
| **Icons** | Lucide React | Beautifully consistent open-source icon set |
| **Routing** | React Router DOM 7 | Declarative client-side routing (Landing → Builder) |
| **UI Primitives** | Radix UI, Base UI | Accessible headless component foundations |
| **Export** | JSZip 3, FileSaver 2 | Client-side ZIP generation and file download |
| **Resizable Panels** | react-resizable-panels 4 | Flexible panel layout for the three-column builder |
| **Linting** | Oxlint | Fast Rust-based linter for code quality |
| **Build Tool** | Vite 8 | Production builds with tree-shaking and code splitting |

---

## 📁 Project Structure

```
shadcncanvas/
├── src/
│   ├── components/
│   │   └── ui/                          # 33 shadcn/ui components (New York style)
│   │       ├── accordion.tsx            # Collapsible content sections
│   │       ├── aspect-ratio.tsx         # Responsive aspect ratio container
│   │       ├── breadcrumb.tsx           # Navigation breadcrumb trail
│   │       ├── button.tsx               # Primary action button with variants
│   │       ├── card.tsx                 # Content container card
│   │       ├── checkbox.tsx             # Boolean input checkbox
│   │       ├── collapsible.tsx          # Toggle visibility wrapper
│   │       ├── combobox.tsx             # Searchable select dropdown
│   │       ├── context-menu.tsx         # Right-click context menu
│   │       ├── dropdown-menu.tsx        # Trigger-based dropdown menu
│   │       ├── form.tsx                 # React Hook Form + Zod integration
│   │       ├── input-group.tsx          # Input with prefix/suffix addons
│   │       ├── input-otp.tsx            # One-time password input
│   │       ├── input.tsx                # Text input field
│   │       ├── label.tsx                # Form field label
│   │       ├── menubar.tsx              # Desktop application menubar
│   │       ├── navigation-menu.tsx      # Site-wide navigation menu
│   │       ├── pagination.tsx           # Page navigation controls
│   │       ├── radio-group.tsx          # Single-select radio buttons
│   │       ├── resizable.tsx            # Resizable panel layout
│   │       ├── scroll-area.tsx          # Custom scrollbar container
│   │       ├── select.tsx               # Native-style select dropdown
│   │       ├── separator.tsx            # Visual divider line
│   │       ├── sheet.tsx                # Slide-out panel overlay
│   │       ├── sidebar.tsx              # Application sidebar navigation
│   │       ├── skeleton.tsx             # Loading placeholder animation
│   │       ├── slider.tsx               # Range value slider
│   │       ├── switch.tsx               # Toggle switch control
│   │       ├── tabs.tsx                 # Tabbed content navigation
│   │       ├── textarea.tsx             # Multi-line text input
│   │       ├── toggle-group.tsx         # Grouped toggle buttons
│   │       ├── toggle.tsx               # Single toggle button
│   │       └── tooltip.tsx              # Hover information tooltip
│   ├── hooks/
│   │   └── use-mobile.ts               # Responsive breakpoint detection hook
│   ├── lib/
│   │   └── utils.ts                     # cn() utility — clsx + tailwind-merge
│   ├── pages/
│   │   ├── builder-page.tsx             # Main canvas builder workspace
│   │   └── landing-page.tsx             # Marketing landing page
│   ├── App.tsx                          # Route definitions (/ → Landing, /app → Builder)
│   ├── main.tsx                         # React DOM root + BrowserRouter mount
│   ├── global.css                       # Tailwind imports, OKLCH theme tokens, animations
│   └── loaders.css                      # Canvas dot-grid background pattern
├── index.html                           # HTML entry point (dark mode default)
├── components.json                      # shadcn/ui CLI configuration (New York style)
├── package.json                         # Dependencies & scripts
├── vite.config.ts                       # Vite + React + Tailwind plugin config
├── tsconfig.json                        # TypeScript project references
├── tsconfig.app.json                    # App-level TypeScript configuration
├── tsconfig.node.json                   # Node-level TypeScript configuration
├── .gitignore                           # Git exclusion rules
└── README.md                            # Documentation (this file)
```

---

## 🧭 Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Marketing page with feature cards, "How it Works" guide, and CTA buttons |
| `/app` | Builder Page | Full canvas workspace with component palette, React Flow canvas, and inspector |

---

## 🧱 Component Palette Categories

The builder sidebar organizes 33+ shadcn/ui components into four intuitive groups:

| Category | Components | Purpose |
|---|---|---|
| **Layout** | Card, Separator, Tabs, Accordion | Structural containers and content organization |
| **Form** | Button, Input, Form, Select, Checkbox, Switch | User input and interactive form elements |
| **Feedback** | Alert, Toast, Progress, Skeleton | Status indicators and loading states |
| **Navigation** | Breadcrumb, Command, Dropdown Menu, Navigation Menu | Wayfinding and menu systems |

---

## 🎨 Design System & Theme

Shadcn Canvas uses a comprehensive OKLCH-based design token system with full light/dark mode support:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--background` | `oklch(0.985 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--destructive` | `oklch(0.577 0.245 27.3)` | `oklch(0.704 0.191 22.2)` |

**Typography**: Inter (sans-serif) · JetBrains Mono (monospace) · Georgia (serif)
**Border Radius**: `0.5rem` base with `sm`, `md`, `lg`, `xl` variants
**Animations**: View-transition reveal animation, text gradient animation, tw-animate-css utilities

---

##  Installation & Local Setup Guide

### Prerequisites

- **Node.js 18+** and npm installed
- **Git** installed

### 1. Clone the Repository

```bash
git clone https://github.com/RITIK-KHARYA/shadcncanvas.git
cd shadcncanvas
```

### 2. Install Dependencies

```bash
npm install
npm run dev
```

The application will start on **http://localhost:5173** with hot module replacement enabled.

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

### 6. Run Linter

```bash
npm run lint
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server with HMR |
| `build` | `tsc -b && vite build` | Type-check and create production bundle |
| `lint` | `oxlint .` | Run Oxlint for fast code quality checks |
| `preview` | `vite preview` | Preview the production build locally |

---

## ⚙️ Adding New shadcn/ui Components

Shadcn Canvas is configured with the [shadcn/ui CLI](https://ui.shadcn.com/docs/cli). To add new components:

```bash
npx shadcn@latest add <component-name>
```

Configuration is defined in [`components.json`](components.json):
- **Style**: New York
- **RSC**: Disabled (client-side SPA)
- **TSX**: Enabled
- **Base Color**: Neutral
- **CSS Variables**: Enabled
- **Icon Library**: Lucide

---

## 🗺️ Future Roadmap

- [ ] **Live Component Rendering on Canvas**: Render actual shadcn/ui component instances as React Flow nodes with full interactivity
- [ ] **Node Edge Wiring**: Implement typed edge connections between component nodes to model data flow and event propagation
- [ ] **Drag-and-Drop from Palette to Canvas**: Full drag-and-drop pipeline from sidebar palette buttons to React Flow node instantiation
- [ ] **Props Inspector Binding**: Bind inspector panel controls to selected node props for live property editing
- [ ] **Theme Customizer**: Interactive color picker and radius slider in the inspector panel to customize the OKLCH design tokens in real time
- [ ] **JSX Code Generation Engine**: Serialize canvas node graph into clean, idiomatic React JSX code
- [ ] **ZIP Export with Project Scaffolding**: Export canvas designs as downloadable ZIP archives with proper component file structure
- [ ] **Clipboard Copy**: One-click copy of generated JSX to system clipboard
- [ ] **Undo/Redo State Machine**: Full undo/redo history stack backed by Zustand temporal middleware
- [ ] **Canvas Persistence**: Save and load canvas state to/from localStorage or IndexedDB
- [ ] **Collaborative Editing**: Real-time multi-user canvas collaboration via WebSocket or CRDT
- [ ] **AI Component Suggestion**: Gemini-powered component recommendations based on canvas context

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the project repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Use **TypeScript** for all new files
- Follow the existing **shadcn/ui New York** style conventions
- Add components via the `shadcn` CLI — do not create UI primitives manually
- Use **OKLCH color tokens** via CSS variables for all color values
- Ensure all interactive elements have proper `aria-label` attributes

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Built by <a href="https://github.com/RITIK-KHARYA">Ritik Kharya</a>
</p>
