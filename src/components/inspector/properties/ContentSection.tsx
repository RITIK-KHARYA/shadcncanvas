import { CollapsibleSection } from "@/components/inspector/CollapsibleSection";
import {
  FormFieldsEditor,
  SelectOptionsEditor,
  TabsEditor,
  type TabItem,
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

  if (node.data.componentType === "tabs") {
    return (
      <CollapsibleSection id="content" title="Tabs">
        <TabsEditor
          tabs={
            Array.isArray(node.data.props.tabs)
              ? (node.data.props.tabs as TabItem[])
              : [
                  { id: "tab-1", label: "Tab 1" },
                  { id: "tab-2", label: "Tab 2" },
                ]
          }
          onChange={(tabs) => {
            setProp("tabs", tabs)
            // keep defaultValue in sync with first tab if it was stale
            const cur = String(node.data.props.defaultValue ?? "")
            if (!tabs.some((t) => t.id === cur) && tabs[0]) setProp("defaultValue", tabs[0].id)
          }}
        />
      </CollapsibleSection>
    )
  }

  return null;
}
