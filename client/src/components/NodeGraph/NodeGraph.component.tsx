import { NodeGraphProvider } from "./NodeGraph.provider";
import { NodeGraphRenderer } from "./NodeGraph.renderer";
import type { NodeData, NodeGraphProps } from "./NodeGraph.types";

export const NodeGraph = <
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>
>(
  props: NodeGraphProps<TNodeId, TNodeData>
) => {
  return (
    <NodeGraphProvider {...props}>
      <NodeGraphRenderer<TNodeId, TNodeData> />
    </NodeGraphProvider>
  );
};
