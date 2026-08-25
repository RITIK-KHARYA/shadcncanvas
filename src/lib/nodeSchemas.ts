import { z } from "zod";

export const nodeSchemas: Record<string, z.ZodType> = {
  button: z.object({
    label: z.string().min(1, "Label required"),
    variant: z.enum([
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ]),
    size: z.enum(["default", "sm", "lg", "icon"]),
  }),
  form: z.object({
    title: z.string().min(1, "Title required"),
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["text", "email", "password", "number"]),
        required: z.boolean(),
      }),
    ),
  }),
  input: z.object({
    placeholder: z.string().min(1, "Placeholder required"),
    inputType: z.enum(["text", "email", "password", "number"]),
  }),
  checkbox: z.object({
    label: z.string().min(1, "Label required"),
  }),
  select: z.object({
    placeholder: z.string().min(1, "Placeholder required"),
    options: z.array(z.string()).min(1, "At least one option required"),
  }),
  switch: z.object({
    label: z.string().min(1, "Label required"),
  }),
  textarea: z.object({
    placeholder: z.string().min(1, "Placeholder required"),
  }),
  card: z.object({
    title: z.string().min(1, "Title required"),
    description: z.string().min(1, "Description required"),
  }),
  badge: z.object({
    label: z.string().min(1, "Label required"),
    variant: z.enum(["default", "secondary", "destructive", "outline"]),
  }),
  label: z.object({
    text: z.string().min(1, "Text required"),
  }),
  tabs: z.object({}),
  separator: z.object({}),
  skeleton: z.object({
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  "button-group": z.object({}),
  calendar: z.object({}),
  field: z.object({
    label: z.string().min(1, "Label required"),
    description: z.string().optional(),
    error: z.string().optional(),
  }),
  "native-select": z.object({
    placeholder: z.string().min(1, "Placeholder required"),
    options: z.array(z.string()).optional(),
  }),
  carousel: z.object({
    slides: z.number().min(2).max(10),
  }),
  item: z.object({
    title: z.string().min(1, "Title required"),
    description: z.string().min(1, "Description required"),
  }),
  dialog: z.object({
    triggerLabel: z.string().min(1, "Trigger label required"),
    title: z.string().min(1, "Title required"),
    description: z.string(),
  }),
  drawer: z.object({
    triggerLabel: z.string().min(1, "Trigger label required"),
    title: z.string().min(1, "Title required"),
    description: z.string(),
  }),
  "hover-card": z.object({
    trigger: z.string().min(1, "Trigger required"),
    heading: z.string().min(1, "Heading required"),
    bio: z.string(),
  }),
  command: z.object({
    placeholder: z.string().min(1, "Placeholder required"),
  }),
  bubble: z.object({
    text: z.string().min(1, "Text required"),
    variant: z.enum(["sent", "received"]),
  }),
  message: z.object({
    text: z.string().min(1, "Text required"),
    role: z.string().min(1, "Author required"),
    variant: z.enum(["sent", "received"]),
  }),
  "message-scroller": z.object({}),
  empty: z.object({
    title: z.string().min(1, "Title required"),
    description: z.string(),
  }),
  chart: z.object({}),
  kbd: z.object({
    keys: z.string().min(1, "Keys required"),
  }),
  marker: z.object({
    text: z.string().min(1, "Text required"),
    highlight: z.string(),
  }),
  direction: z.object({
    dir: z.enum(["ltr", "rtl"]),
  }),
  toast: z.object({
    message: z.string().min(1, "Message required"),
    variant: z.enum(["success", "error"]),
  }),
  apiCall: z.object({
    url: z.string().url("Must be a valid URL"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    headers: z.array(z.object({ key: z.string(), value: z.string() })),
    bodyMode: z.enum(["bound", "static"]),
    staticBody: z.string().refine((v) => {
      try {
        JSON.parse(v);
        return true;
      } catch {
        return false;
      }
    }, "Must be valid JSON"),
    timeoutMs: z.number().min(1000).max(60000),
  }),
};

export function validateNode(componentType: string, props: unknown) {
  const schema = nodeSchemas[componentType];
  if (!schema) return { success: true as const, data: props };
  return schema.safeParse(props);
}

export function getFieldErrors(
  componentType: string,
  props: unknown,
): Record<string, string> {
  const schema = nodeSchemas[componentType];
  if (!schema) return {};

  const result = schema.safeParse(props);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "root");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
