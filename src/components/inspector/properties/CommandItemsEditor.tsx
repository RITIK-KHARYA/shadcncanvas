import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type CommandItem = { id: string; label: string }

export function CommandItemsEditor({
  items,
  onChange,
}: {
  items: CommandItem[]
  onChange: (items: CommandItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<CommandItem>) => {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  const addItem = () => {
    const n = items.length + 1
    onChange([...items, { id: `item-${n}`, label: `Item ${n}` }])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    const next = [...items]
    const j = index + dir
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">Command items</Label>
      {items.map((item, index) => (
        <div key={index} className="space-y-1.5 rounded-md border p-2">
          <Input
            className="h-8"
            placeholder="Label"
            value={item.label}
            onChange={(e) => updateItem(index, { label: e.target.value })}
          />
          <Input
            className="h-8"
            placeholder="ID"
            value={item.id}
            onChange={(e) => updateItem(index, { id: e.target.value.replace(/\s+/g, "-") })}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
              >
                ↓
              </Button>
            </div>
            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => removeItem(index)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={addItem}>
        <Plus className="size-3.5" />
        Add item
      </Button>
    </div>
  )
}
