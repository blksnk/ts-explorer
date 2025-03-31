import {
  NODE_GRAPH_CONTEXT,
  useNodeGraphStore,
  type NodeGraphContext,
} from "./NodeGraph.context";
import type {
  NodeData,
  NodeGraphProviderProps,
  ValidNodeId,
} from "./NodeGraph.types";

/**
 * Provider component for the NodeGraph context
 * @template TNodeId - Type for node ID (number or string)
 * @template TNodeData - Type for node data extending NodeData<TNodeId>
 * @template TNodeType - Type for node type extending AvailableNodeType
 */
export const NodeGraphProvider = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
>({
  children,
  ...props
}: NodeGraphProviderProps<TNodeId, TNodeData>) => {
  const store = useNodeGraphStore<TNodeId, TNodeData>(props);

  return (
    <NODE_GRAPH_CONTEXT.Provider
      value={store as NodeGraphContext<ValidNodeId, NodeData<ValidNodeId>>}
    >
      {children}
    </NODE_GRAPH_CONTEXT.Provider>
  );
};
