import { NodeGraphProvider } from "./NodeGraph.provider";
import { NodeGraphRenderer } from "./NodeGraph.renderer";
import type {
  AvailableNodeType,
  NodeData,
  NodeGraphProps,
} from "./NodeGraph.types";

export const NodeGraph = <
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
>(
  props: NodeGraphProps<TNodeId, TNodeData, TNodeType>
) => {
  return (
    <NodeGraphProvider {...props}>
      <NodeGraphRenderer<TNodeId, TNodeData, TNodeType> />
    </NodeGraphProvider>
  );
};
