import { z } from "zod"

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
}

export function validateNode(componentType: string, props: unknown) {
  const schema = nodeSchemas[componentType]
  if (!schema) return { success: true as const, data: props }
  return schema.safeParse(props)
}

export function getFieldErrors(
  componentType: string,
  props: unknown,
): Record<string, string> {
  const schema = nodeSchemas[componentType]
  if (!schema) return {}

  const result = schema.safeParse(props)
  if (result.success) return {}

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "root")
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}
