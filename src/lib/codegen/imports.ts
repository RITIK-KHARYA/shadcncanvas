import { UI_COMPONENTS } from "@/lib/registry"

export function buildImports(types: string[]): string {
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
    } else if (type === "apiCall") {
      // Renders a plain status <div> — no shadcn component import needed.
    } else {
      lines.add(
        `import { ${ui.exportName} } from "@/components/ui/${ui.importPath}"`,
      )
    }
  }

  return [...lines].join("\n")
}
