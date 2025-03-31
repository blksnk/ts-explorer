import type {
  KeyOf,
  MaybeAsyncFn,
  Nullable,
  VoidFn,
} from "@ubloimmo/front-util";
import type { Edge, Node } from "@xyflow/react";
import type { customNodes } from "../nodes";
import type { ReactNode } from "react";
import type { CustomEdge } from "../edges";

export type ValidNodeId = number | string;

export type NodeData<TId extends ValidNodeId> = Record<string, unknown> & {
  id: TId;
};

export type AvailableNodeType =
  | KeyOf<typeof customNodes, string>
  | "default"
  | "input"
  | "output";

export type NodePosition = {
  x?: number;
  y?: number;
};

export type NodeGraphNodeDefinition<TNodeData extends NodeData<ValidNodeId>> = {
  data: TNodeData;
  type: AvailableNodeType;
  position?: NodePosition;
};

export type NodeGraphEdgeDefinition<TId extends ValidNodeId> = {
  id: TId;
  source: TId;
  target: TId;
};

export type OnNodeSelectionChangeFn<TId extends ValidNodeId> = VoidFn<
  [selectedNodeId: Nullable<TId>, selectedNodeType: Nullable<AvailableNodeType>]
>;

export type GetInitialNodesFn<
  TId extends ValidNodeId,
  TNodeData extends NodeData<TId>
> = MaybeAsyncFn<[], NodeGraphNodeDefinition<TNodeData>[]>;

export type NodeGraphProps<
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>
> = {
  getInitialNodes?: GetInitialNodesFn<TNodeId, TNodeData>;
  initialEdges: NodeGraphEdgeDefinition<TNodeId>[];
  onNodeSelectionChange?: OnNodeSelectionChangeFn<TNodeId>;
};

export type NodeGraphNode<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
> = Node<TNodeData, AvailableNodeType>;

// TODO: make this type generic when we'll need to store data on edges
export type NodeGraphEdge = Edge | CustomEdge;
export type NodeGraphProviderProps<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
> = NodeGraphProps<TNodeId, TNodeData> & {
  children?: ReactNode;
};

export type NodeGraphNodesMap<
  TId extends ValidNodeId,
  TNodeData extends NodeData<TId>
> = Map<string, NodeGraphNode<TId, TNodeData>>;

export type NodeGraphEdgesMap = Map<string, NodeGraphEdge>;
