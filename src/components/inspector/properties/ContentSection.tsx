import { CollapsibleSection } from "@/components/inspector/CollapsibleSection";
import {
  FormFieldsEditor,
  SelectOptionsEditor,
} from "@/components/inspector/FormFieldsEditor";
import { useGraphStore } from "@/store/graph-store";
import type { CanvasNode } from "@/types/graph";

export function ContentSection({ node }: { node: CanvasNode }) {
  const updateNodeProps = useGraphStore((s) => s.updateNodeProps);
  const setProp = (key: string, value: unknown) => {
    updateNodeProps(node.id, { [key]: value });
  };

  if (node.data.componentType === "form") {
    return (
      <CollapsibleSection id="content" title="Form fields">
        <FormFieldsEditor
          fields={
            Array.isArray(node.data.props.fields)
              ? (node.data.props.fields as {
                  name: string;
                  type: "text" | "email" | "password" | "number";
                  required: boolean;
                  placeholder?: string;
                }[])
              : []
          }
          onChange={(fields) => setProp("fields", fields)}
        />
      </CollapsibleSection>
    );
  }

  if (node.data.componentType === "select") {
    return (
      <CollapsibleSection id="content" title="Options">
        <SelectOptionsEditor
          options={
            Array.isArray(node.data.props.options)
              ? (node.data.props.options as string[])
              : ["Option 1", "Option 2"]
          }
          onChange={(options) => setProp("options", options)}
        />
      </CollapsibleSection>
    );
  }

  return null;
}
