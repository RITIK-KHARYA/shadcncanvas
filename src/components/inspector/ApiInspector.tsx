import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/inspector/CollapsibleSection";
import {
  HeadersEditor,
  type ApiHeader,
} from "@/components/inspector/HeadersEditor";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Segmented } from "@/components/inspector/Segmented";
import { Textarea } from "@/components/ui/textarea";
import { getFieldErrors } from "@/lib/nodeSchemas";
import { useGraphStore } from "@/store/graphStore";
import type { CanvasNode } from "@/types/graph";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

/** Mirrors nodeSchemas.apiCall's `staticBody` refine (must parse as JSON). */
function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function ApiInspector({ node }: { node: CanvasNode }) {
  const updateNodeProps = useGraphStore((s) => s.updateNodeProps);
  const triggerApiCall = useGraphStore((s) => s.triggerApiCall);
  const [isTesting, setIsTesting] = useState(false);

  const setProp = (key: string, value: unknown) => {
    updateNodeProps(node.id, { [key]: value });
  };

  const props = node.data.props;
  const state = node.data.state;

  const url = String(props.url ?? "");
  const method = String(props.method ?? "POST");
  const bodyMode = String(props.bodyMode ?? "bound") as "bound" | "static";
  const staticBody = String(props.staticBody ?? "{}");
  const timeoutMs = Number(props.timeoutMs ?? 10000);
  const headers = Array.isArray(props.headers)
    ? (props.headers as ApiHeader[])
    : [];

  const staticBodyValid = bodyMode !== "static" || isValidJson(staticBody);
  const fieldErrors = getFieldErrors("apiCall", props);

  const status = String(state.status ?? "idle");
  const responseText =
    status === "error"
      ? String(state.error ?? "")
      : status === "success"
        ? String(state.data ?? "")
        : "";

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await triggerApiCall(node.id);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <div
        role="alert"
        className="mx-3 mt-3 flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400"
      >
        <TriangleAlert
          className="mt-0.5 size-3.5 shrink-0"
          aria-hidden="true"
        />
        <p>
          Requests fire directly from the browser. Don&apos;t put secret API
          keys or tokens in headers here — they&apos;ll be visible in exported
          code and browser devtools. Use a backend proxy for authenticated
          calls.
        </p>
      </div>

      <CollapsibleSection id="api-call" title="API Request" defaultExpanded>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label
              htmlFor="api-url"
              className="text-[11px] font-normal text-muted-foreground"
            >
              Endpoint URL
            </Label>
            <Input
              id="api-url"
              className={cn(
                "h-7 bg-background text-xs shadow-none",
                fieldErrors.url && "border-destructive",
              )}
              placeholder="https://api.example.com/submit"
              value={url}
              onChange={(e) => setProp("url", e.target.value)}
            />
            {fieldErrors.url && (
              <p className="text-[11px] text-destructive">{fieldErrors.url}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="api-method"
              className="text-[11px] font-normal text-muted-foreground"
            >
              Method
            </Label>
            <Select
              value={method}
              onValueChange={(value) => setProp("method", value)}
            >
              <SelectTrigger
                id="api-method"
                className="h-7 w-full bg-background text-xs shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-normal text-muted-foreground">
              Body Source
            </Label>
            <Segmented
              value={bodyMode}
              options={[
                { value: "bound", label: "Bound to Form" },
                { value: "static", label: "Static JSON" },
              ]}
              onChange={(value) => setProp("bodyMode", value)}
            />

            {bodyMode === "static" && (
              <div className="space-y-1">
                <Textarea
                  aria-label="Static JSON body"
                  className={cn(
                    "min-h-20 bg-background font-mono text-xs shadow-none",
                    !staticBodyValid &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                  value={staticBody}
                  onChange={(e) => setProp("staticBody", e.target.value)}
                />
                {!staticBodyValid && (
                  <p className="text-[11px] text-destructive">
                    Must be valid JSON
                  </p>
                )}
              </div>
            )}
          </div>

          <HeadersEditor
            headers={headers}
            onChange={(next) => setProp("headers", next)}
          />

          <div className="space-y-1">
            <Label
              htmlFor="api-timeout"
              className="text-[11px] font-normal text-muted-foreground"
            >
              Timeout (ms)
            </Label>
            <InputGroup className="h-7">
              <InputGroupInput
                id="api-timeout"
                type="number"
                min={1000}
                max={60000}
                className="h-7 text-xs"
                value={timeoutMs}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (Number.isFinite(next)) setProp("timeoutMs", next);
                }}
              />
              <InputGroupAddon align="inline-end" className="pr-2">
                <InputGroupText className="text-[10px]">ms</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isTesting || status === "loading" || !url}
            onClick={handleTest}
          >
            {isTesting || status === "loading" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Test Request"
            )}
          </Button>

          {status !== "idle" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-normal text-muted-foreground">
                  Response
                </Label>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-medium capitalize",
                    status === "success" && "bg-green-100 text-green-700",
                    status === "error" && "bg-red-100 text-red-700",
                    status === "loading" && "bg-blue-100 text-blue-700",
                  )}
                >
                  {status}
                </span>
              </div>
              <pre className="scrollbar-thin max-h-40 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px] wrap-break-word whitespace-pre-wrap">
                {responseText || "—"}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </>
  );
}
