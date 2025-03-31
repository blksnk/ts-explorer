import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  NodeGraphNode,
  type NodeData,
  type NodeGraphEdge,
  type NodeGraphEdgesMap,
  type NodeGraphNodeDefinition,
  type NodeGraphNodesMap,
  type NodeGraphProps,
  type ValidNodeId,
} from "./NodeGraph.types";
import {
  nodeDefinitionToNodeGraphNode,
  nodeGraphEdgesToMap,
  nodeGraphNodesToMap,
} from "./NodeGraph.utils";
import {
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  type EdgeChange,
  type HandleType,
  type NodeChange,
} from "@xyflow/react";
import { useStatic } from "@ubloimmo/uikit";
import { isString, type Nullable, type Nullish } from "@ubloimmo/front-util";

export const useNodeGraphStore = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
>({
  getInitialNodes,
  onNodeSelectionChange,
}: NodeGraphProps<TNodeId, TNodeData>) => {
  const [nodeMap, setNodeMap] = useState<NodeGraphNodesMap<TNodeId, TNodeData>>(
    new Map()
  );

  const [updateEdges, setUpdateEdges] = useState(false);
  const [edgeMap, setEdgeMap] = useState<NodeGraphEdgesMap>(new Map());
  const changeEdgeMap = useCallback(
    (callback: (edges: NodeGraphEdgesMap) => NodeGraphEdgesMap) => {
      setEdgeMap((eds) => callback(eds));
      setUpdateEdges(!updateEdges);
    },
    [updateEdges]
  );

  useStatic(async () => {
    if (!getInitialNodes) return;
    const initialNodes = await getInitialNodes();
    const nodeDefs = initialNodes.map((node) =>
      nodeDefinitionToNodeGraphNode(node)
    );
    setNodeMap(nodeGraphNodesToMap(nodeDefs));
  });

  const addNodes = useCallback((nodes: NodeGraphNode<TNodeId, TNodeData>[]) => {
    setNodeMap((nds) => {
      for (const node of nodes) {
        if (nds.has(node.id)) continue;
        nds.set(node.id, node);
      }
      return nds;
    });
  }, []);

  const addEdges = useCallback(
    (edges: NodeGraphEdge[]) => {
      changeEdgeMap((eds) => {
        for (const edge of edges) {
          if (eds.has(edge.id)) continue;
          eds.set(edge.id, edge);
        }
        return eds;
      });
    },
    [changeEdgeMap]
  );

  const connectToExistingNodes = useCallback(
    (baseNodeId: string, existingNodeIds: TNodeId[], connectAs: HandleType) => {
      const connectAsTarget = connectAs === "target";
      const connectableNodeIds = existingNodeIds
        .map(String)
        .filter((id) => nodeMap.has(id));
      const newEdges = connectableNodeIds.map((id): NodeGraphEdge => {
        const sourceId = connectAsTarget ? baseNodeId : id;
        const targetId = connectAsTarget ? id : baseNodeId;
        return {
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          animated: true,
          type: "relationship",
        };
      });
      addEdges(newEdges);
    },
    [addEdges, nodeMap]
  );

  const addConnectedNodes = useCallback(
    (
      baseNodeId: string,
      newNodeData: NodeGraphNodeDefinition<TNodeData>[],
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
          type: "relationship",
        };
      });
      addNodes(newNodes);
      addEdges(newEdges);
    },
    [addEdges, addNodes]
  );

  const nodes = useMemo(() => Array.from(nodeMap.values()), [nodeMap]);
  const edges = useMemo(() => {
    return Array.from(edgeMap.values());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeMap, updateEdges]);

  const setEdgesSelection = useCallback(
    (edgeIds: string[]) => {
      changeEdgeMap((eds) => {
        for (const [edgeId, edge] of eds.entries()) {
          const selected = edgeIds.includes(edgeId);
          eds.set(edgeId, {
            ...edge,
            selected,
          });
        }
        return eds;
      });
    },
    [changeEdgeMap]
  );

  const selectConnectedEdges = useCallback(
    (nodeId: string) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;
      const connectedEdgeIds = getConnectedEdges([node], edges).map(
        ({ id }) => id
      );

      if (!connectedEdgeIds.length) return;
      setEdgesSelection(connectedEdgeIds);
    },
    [edges, nodeMap, setEdgesSelection]
  );

  const clearEdgesSelection = useCallback(() => {
    changeEdgeMap((eds) => {
      for (const [edgeId, edge] of eds.entries()) {
        if (!edge.selected) continue;
        eds.set(edgeId, {
          ...edge,
          selected: false,
        });
      }
      return eds;
    });
  }, [changeEdgeMap]);

  const callNodeSelectionCallback = useCallback(
    (nodeId: Nullish<string>) => {
      if (!isString(nodeId)) {
        onNodeSelectionChange?.(null, null);
        clearEdgesSelection();
        return;
      }
      const selectedNode = nodeMap.get(nodeId);
      if (!selectedNode) return onNodeSelectionChange?.(null, null);
      const { data, type } = selectedNode;
      const dataId: Nullable<TNodeId> = data.id;
      onNodeSelectionChange?.(dataId, type ?? null);
      selectConnectedEdges(nodeId);
    },
    [nodeMap, onNodeSelectionChange, selectConnectedEdges, clearEdgesSelection]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeGraphNode<TNodeId, TNodeData>>[]) => {
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
      setNodeMap((nds) => {
        const nodeArr = Array.from(nds.values());
        return nodeGraphNodesToMap(applyNodeChanges(changes, nodeArr));
      });
    },
    [callNodeSelectionCallback, onNodeSelectionChange]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<NodeGraphEdge>[]) => {
      // edge selection is manually handled
      if (changes.some(({ type }) => type === "select")) return;
      changeEdgeMap((eds) => {
        const edgeArr = Array.from(eds.values());
        return nodeGraphEdgesToMap(applyEdgeChanges(changes, edgeArr));
      });
    },
    [changeEdgeMap]
  );

  return {
    nodes,
    edges,
    setNodes: setNodeMap,
    setEdges: setEdgeMap,
    onNodesChange,
    onEdgesChange,
    addConnectedNodes,
    connectToExistingNodes,
    selectEdges: setEdgesSelection,
    selectConnectedEdges,
  };
};

export type NodeGraphContext<
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
> = ReturnType<typeof useNodeGraphStore<TNodeId, TNodeData>>;

export const NODE_GRAPH_CONTEXT = createContext<
  NodeGraphContext<ValidNodeId, NodeData<ValidNodeId>>
>({
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  addConnectedNodes: () => {},
  connectToExistingNodes: () => {},
  selectEdges: () => {},
  selectConnectedEdges: () => {},
});

export const useNodeGraphContext = <
  TNodeId extends ValidNodeId,
  TNodeData extends NodeData<TNodeId>
>() => useContext(NODE_GRAPH_CONTEXT) as NodeGraphContext<TNodeId, TNodeData>;
