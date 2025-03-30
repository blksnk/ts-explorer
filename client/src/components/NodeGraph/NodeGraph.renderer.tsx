import { ReactFlow, type ProOptions } from "@xyflow/react";
import { useNodeGraphContext } from "./NodeGraph.context";
import type {
  AvailableNodeType,
  NodeData,
  NodeGraphEdge,
  NodeGraphNode,
} from "./NodeGraph.types";
import styled from "styled-components";
import { customNodes } from "../nodes";

const proOptions: ProOptions = {
  hideAttribution: true,
};

export const NodeGraphRenderer = <
  TNodeId extends number | string,
  TNodeData extends NodeData<TNodeId>,
  TNodeType extends AvailableNodeType
>() => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useNodeGraphContext<
    TNodeId,
    TNodeData,
    TNodeType
  >();

  return (
    <FlowWrapper>
      <ReactFlow<NodeGraphNode<TNodeId, TNodeData, TNodeType>, NodeGraphEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={customNodes}
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
