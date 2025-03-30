import type {
  NodeData,
  NodeGraphNode,
  AvailableNodeType,
  NodeGraphNodeDefinition,
  NodeGraphEdgeDefinition,
  NodeGraphEdge,
  ValidNodeId,
} from "./NodeGraph.types";

/**
 * Converts node data to a node graph node format compatible with XYFlow
 * @template TNodeId - Type for node ID (number or string)
 * @template TNodeData - Type for node data extending NodeData<TNodeId>
 */
export const nodeDefinitionToNodeGraphNode = <
  TNodeId extends ValidNodeId,
  TNodeType extends AvailableNodeType,
  TNodeData extends NodeData<TNodeId>
>({
  type,
  data,
  position: { x = 0, y = 0 } = {},
}: NodeGraphNodeDefinition<TNodeData, TNodeType>): NodeGraphNode<
  TNodeId,
  TNodeData,
  TNodeType
> => {
  return {
    id: String(data.id),
    data,
    position: { x, y },
    type,
    // origin: [0.5, 0.5],
  };
};

/**
 * Converts edge definition to a node graph edge format compatible with XYFlow
 * @template TId - Type for edge ID (number or string)
 * @param edge - Edge definition containing id, source and target
 * @returns NodeGraphEdge formatted for XYFlow
 */
export const edgeDefinitionToNodeGraphEdge = <TId extends ValidNodeId>(
  edge: NodeGraphEdgeDefinition<TId>
): NodeGraphEdge => {
  return {
    id: String(edge.id),
    source: String(edge.source),
    target: String(edge.target),
  };
};
