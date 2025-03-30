import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  NodeGraphNode,
  type AvailableNodeType,
  type NodeData,
  type NodeGraphEdge,
  type NodeGraphNodeDefinition,
  type NodeGraphProps,
  type ValidNodeId,
} from "./NodeGraph.types";
import {
  edgeDefinitionToNodeGraphEdge,
  nodeDefinitionToNodeGraphNode,
} from "./NodeGraph.utils";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type HandleType,
  type NodeChange,
} from "@xyflow/react";
import { useStatic } from "@ubloimmo/uikit";
import { isString, type Nullable, type Nullish } from "@ubloimmo/front-util";

export const useNodeGraphStore = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
>({
  getInitialNodes,
  onNodeSelectionChange,
  initialEdges,
}: NodeGraphProps<TNodeId, TNodeData, TNodeType>) => {
  const [nodes, setNodes] = useState<
    NodeGraphNode<TNodeId, TNodeData, TNodeType>[]
  >([]);

  const [edges, setEdges] = useState<NodeGraphEdge[]>(
    initialEdges.map(edgeDefinitionToNodeGraphEdge)
  );
  const nodeIds = useMemo(() => nodes.map(({ id }) => id), [nodes]);
  const edgeIds = useMemo(() => edges.map(({ id }) => id), [edges]);

  useStatic(async () => {
    if (!getInitialNodes) return;
    const initialNodes = await getInitialNodes();
    setNodes(initialNodes.map((node) => nodeDefinitionToNodeGraphNode(node)));
  });

  const callNodeSelectionCallback = useCallback(
    (nodeId: Nullish<string>) => {
      if (!onNodeSelectionChange) return;
      if (!isString(nodeId)) return onNodeSelectionChange(null);
      const dataId: Nullable<TNodeId> =
        nodes.find(({ id }) => id === nodeId)?.data.id ?? null;
      onNodeSelectionChange(dataId);
    },
    [onNodeSelectionChange, nodes]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeGraphNode<TNodeId, TNodeData, TNodeType>>[]) => {
      if (onNodeSelectionChange) {
        const selectionChanges = changes.filter(
          (change) => change.type === "select"
        );
        if (selectionChanges.length) {
          const selectedNodeId = selectionChanges.find(
            (change) => change.selected
          )?.id;
          callNodeSelectionCallback(selectedNodeId);
        }
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [callNodeSelectionCallback, onNodeSelectionChange]
  );

  const onEdgesChange = useCallback((changes: EdgeChange<NodeGraphEdge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const addNodes = useCallback(
    (nodes: NodeGraphNode<TNodeId, TNodeData, TNodeType>[]) => {
      setNodes((nds) => [
        ...nds,
        ...nodes.filter((node) => !nodeIds.includes(node.id)),
      ]);
    },
    [nodeIds]
  );

  const addEdges = useCallback(
    (edges: NodeGraphEdge[]) => {
      setEdges((eds) => [
        ...eds,
        ...edges.filter((edge) => !edgeIds.includes(edge.id)),
      ]);
    },
    [edgeIds]
  );

  const addConnectedNodes = useCallback(
    (
      baseNodeId: string,
      newNodeData: NodeGraphNodeDefinition<TNodeData, TNodeType>[],
      connectAs: HandleType
    ) => {
      const newNodes = newNodeData.map((data) =>
        nodeDefinitionToNodeGraphNode(data)
      );
      const connectAsTarget = connectAs === "target";
      const newEdges = newNodes.map(({ id }): NodeGraphEdge => {
        const sourceId = connectAsTarget ? baseNodeId : id;
        const targetId = connectAsTarget ? id : baseNodeId;
        return {
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          animated: true,
        };
      });
      addNodes(newNodes);
      addEdges(newEdges);
    },
    [addEdges, addNodes]
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    addConnectedNodes,
  };
};

export type NodeGraphContext<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
> = ReturnType<typeof useNodeGraphStore<TNodeId, TNodeData, TNodeType>>;

export const NODE_GRAPH_CONTEXT = createContext<
  NodeGraphContext<ValidNodeId, NodeData<ValidNodeId>, AvailableNodeType>
>({
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  addConnectedNodes: () => {},
});

export const useNodeGraphContext = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
>() =>
  useContext(NODE_GRAPH_CONTEXT) as NodeGraphContext<
    TNodeId,
    TNodeData,
    TNodeType
  >;
