import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type ApiHeader = { key: string; value: string }

type HeadersEditorProps = {
  headers: ApiHeader[]
  onChange: (headers: ApiHeader[]) => void
}

/** Key/value list editor for HTTP headers, following the FormFieldsEditor pattern. */
export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const updateHeader = (index: number, patch: Partial<ApiHeader>) => {
    onChange(headers.map((header, i) => (i === index ? { ...header, ...patch } : header)))
  }

  const addHeader = () => {
    onChange([...headers, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    onChange(headers.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">Headers</Label>
      {headers.map((header, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <Input
            className="h-7 flex-1 text-xs"
            placeholder="Header-Name"
            value={header.key}
            onChange={(e) => updateHeader(index, { key: e.target.value })}
          />
          <Input
            className="h-7 flex-1 text-xs"
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateHeader(index, { value: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove header"
            onClick={() => removeHeader(index)}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={addHeader}>
        <Plus className="size-3.5" aria-hidden="true" />
        Add header
      </Button>
    </div>
  )
}
