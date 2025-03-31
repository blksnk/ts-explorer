import type { Edge, EdgeProps } from "@xyflow/react";

export type RelationshipFlowEdgeData = {
  isWarning?: boolean;
};

export type RelationshipFlowEdgeType = Edge<
  RelationshipFlowEdgeData,
  "relationship"
>;

export type RelationshipFlowEdgeProps = EdgeProps<RelationshipFlowEdgeType>;
