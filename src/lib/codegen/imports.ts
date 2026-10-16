import { UI_COMPONENTS, getEffect } from "@/lib/registry"

export function buildImports(types: string[], effectIds: string[] = []): string {
  const lines = new Set<string>()

  for (const type of types) {
    const ui = UI_COMPONENTS[type]
    if (!ui) continue

    if (type === "card" || type === "form") {
      lines.add(
        `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"`,
      )
      if (type === "form") {
        lines.add(`import { Button } from "@/components/ui/button"`)
        lines.add(`import { Input } from "@/components/ui/input"`)
      }
    } else if (type === "select") {
      lines.add(
        `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`,
      )
    } else if (type === "tabs") {
      lines.add(
        `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
      )
    } else if (type === "chart") {
      lines.add(`import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"`)
      lines.add(`import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"`)
    } else if (type === "apiCall") {
      // Renders a plain status <div> — no shadcn component import needed.
    } else if (type === "toast") {
      lines.add(`import { toast } from "sonner"`);
      lines.add(`import { useEffect } from "react"`);
    } else if (ui.pkg) {
      lines.add(`import { ${ui.exportName} } from "${ui.pkg}"`);
    } else if (ui.importPath.startsWith("evilcharts/")) {
      lines.add(
        `import { ${ui.exportName} } from "@/components/${ui.importPath}"`,
      )
    } else {
      lines.add(
        `import { ${ui.exportName} } from "@/components/ui/${ui.importPath}"`,
      )
    }
  }

  for (const id of effectIds) {
    const def = getEffect(id)
    if (def && def.kind === "wrapper") {
      lines.add(`import { ${def.exportName} } from "${def.pkg}"`)
    }
  }

  return [...lines].join("\n")
}
