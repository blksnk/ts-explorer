import type {
  KeyOf,
  MaybeAsyncFn,
  Nullable,
  VoidFn,
} from "@ubloimmo/front-util";
import type { Edge, Node } from "@xyflow/react";
import type { customNodes } from "../nodes";
import type { ReactNode } from "react";

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

export type NodeGraphNodeDefinition<
  TNodeData extends NodeData<ValidNodeId>,
  TNodeType extends AvailableNodeType
> = {
  data: TNodeData;
  type: TNodeType;
  position?: NodePosition;
};

export type NodeGraphEdgeDefinition<TId extends ValidNodeId> = {
  id: TId;
  source: TId;
  target: TId;
};

export type OnNodeSelectionChangeFn<TId extends ValidNodeId> = VoidFn<
  [selectedNodeId: Nullable<TId>]
>;

export type GetInitialNodesFn<
  TId extends ValidNodeId,
  TNodeData extends NodeData<TId>,
  TNodeType extends AvailableNodeType
> = MaybeAsyncFn<[], NodeGraphNodeDefinition<TNodeData, TNodeType>[]>;

export type NodeGraphProps<
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
> = {
  getInitialNodes?: GetInitialNodesFn<TNodeId, TNodeData, TNodeType>;
  initialEdges: NodeGraphEdgeDefinition<TNodeId>[];
  nodeTypes: TNodeType[];
  onNodeSelectionChange?: OnNodeSelectionChangeFn<TNodeId>;
};

export type NodeGraphNode<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
> = Node<TNodeData, TNodeType>;

// TODO: make this type generic when we'll need to store data on edges
export type NodeGraphEdge = Edge;

export type NodeGraphProviderProps<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
> = NodeGraphProps<TNodeId, TNodeData, TNodeType> & {
  children?: ReactNode;
};
