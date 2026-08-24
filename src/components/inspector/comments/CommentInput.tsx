import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CommentInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("")

  const submit = () => {
    if (!value.trim()) return
    onSubmit(value)
    setValue("")
  }

  return (
    <div className="flex items-center gap-1.5 border-t px-3 py-2.5">
      <Input
        aria-label="Reply"
        placeholder="Reply…"
        className="h-7 bg-background text-xs shadow-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit()
        }}
      />
      <Button
        type="button"
        size="icon-sm"
        aria-label="Add comment"
        disabled={!value.trim()}
        onClick={submit}
      >
        <Send className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
