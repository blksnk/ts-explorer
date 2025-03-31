import { ReactFlow, type ProOptions } from "@xyflow/react";
import { useNodeGraphContext } from "./NodeGraph.context";
import type { NodeData, NodeGraphEdge, NodeGraphNode } from "./NodeGraph.types";
import styled from "styled-components";
import { customNodes } from "../nodes";
import { customEdges } from "../edges";

const proOptions: ProOptions = {
  hideAttribution: true,
};

export const NodeGraphRenderer = <
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>
>() => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useNodeGraphContext<
    TNodeId,
    TNodeData
  >();

  return (
    <FlowWrapper>
      <ReactFlow<NodeGraphNode<TNodeId, TNodeData>, NodeGraphEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={customNodes}
        edgeTypes={customEdges}
        proOptions={proOptions}
        fitView
      />
    </FlowWrapper>
  );
};

const FlowWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
`;
