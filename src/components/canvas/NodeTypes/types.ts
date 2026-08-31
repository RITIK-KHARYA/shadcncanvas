import type { NodeState, NodeSizeMode, NodeStyleOverride } from "@/types/graph";

export type FormField = {
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

export type NodePreviewProps = {
  componentType: string;
  props: Record<string, unknown>; 
  state: NodeState;
  sizeMode?: NodeSizeMode;
  style?: NodeStyleOverride;
  onOutputChange?: (
    outputKey: string,
    value: boolean | string | number,
  ) => void;
  onOutputsChange?: (outputs: NodeState) => void;
};
