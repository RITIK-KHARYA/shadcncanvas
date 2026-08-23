import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type FormField = {
  name: string
  type: "text" | "email" | "password" | "number"
  required: boolean
  placeholder?: string
}

type FormFieldsEditorProps = {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

export function FormFieldsEditor({ fields, onChange }: FormFieldsEditorProps) {
  const updateField = (index: number, patch: Partial<FormField>) => {
    onChange(fields.map((field, i) => (i === index ? { ...field, ...patch } : field)))
  }

  const addField = () => {
    onChange([
      ...fields,
      {
        name: `field${fields.length + 1}`,
        type: "text",
        required: false,
        placeholder: "New field",
      },
    ])
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">Form fields</Label>
      {fields.map((field, index) => (
        <div key={index} className="space-y-1.5 rounded-md border p-2">
          <Input
            className="h-8"
            placeholder="Name"
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
          />
          <Select
            value={field.type}
            onValueChange={(value: FormField["type"]) =>
              updateField(index, { type: value })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["text", "email", "password", "number"] as const).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="h-8"
            placeholder="Placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) => updateField(index, { placeholder: e.target.value })}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
              />
              Required
            </label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => removeField(index)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={addField}>
        <Plus className="size-3.5" />
        Add field
      </Button>
    </div>
  )
}

type SelectOptionsEditorProps = {
  options: string[]
  onChange: (options: string[]) => void
}

export function SelectOptionsEditor({ options, onChange }: SelectOptionsEditorProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="select-options" className="text-xs">
        Options (one per line)
      </Label>
      <Textarea
        id="select-options"
        className="min-h-20 text-xs"
        value={options.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          )
        }
      />
    </div>
  )
}
