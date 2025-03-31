import type {
  NodeData,
  NodeGraphNode,
  NodeGraphNodeDefinition,
  NodeGraphEdgeDefinition,
  NodeGraphEdge,
  ValidNodeId,
  NodeGraphNodesMap,
  NodeGraphEdgesMap,
} from "./NodeGraph.types";

/**
 * Converts node data to a node graph node format compatible with XYFlow
 * @template TNodeId - Type for node ID (number or string)
 * @template TNodeData - Type for node data extending NodeData<TNodeId>
 */
export const nodeDefinitionToNodeGraphNode = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
>({
  type,
  data,
  position: { x = 0, y = 0 } = {},
}: NodeGraphNodeDefinition<TNodeData>): NodeGraphNode<TNodeId, TNodeData> => {
  return {
    id: String(data.id),
    data,
    position: { x, y },
    type,
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
    type: "relationship",
  };
};

/**
 * Converts an array of node graph nodes to a Map keyed by node ID
 * @template TNodeId - Type for node ID (number or string)
 * @template TNodeData - Type for node data extending NodeData<TNodeId>
 * @template TNodeType - Type for available node types
 */
export const nodeGraphNodesToMap = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
>(
  nodes: NodeGraphNode<TNodeId, TNodeData>[]
): NodeGraphNodesMap<TNodeId, TNodeData> => {
  return new Map(nodes.map((node): [string, typeof node] => [node.id, node]));
};

/**
 * Converts an array of node graph edges to a Map keyed by edge ID
 * @param edges - Array of NodeGraphEdge objects
 * @returns Map of edges with edge IDs as keys and NodeGraphEdge objects as values
 */
export const nodeGraphEdgesToMap = (
  edges: NodeGraphEdge[]
): NodeGraphEdgesMap => {
  return new Map(edges.map((edge): [string, typeof edge] => [edge.id, edge]));
};
