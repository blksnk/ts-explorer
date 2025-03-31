import type { KeyOf } from "@ubloimmo/front-util";
import {
  RelationshipFlowEdge,
  type RelationshipFlowEdgeType,
} from "./FlowEdge";

export const customEdges = {
  relationship: RelationshipFlowEdge,
} as const;

export type CustomEdgeType = KeyOf<typeof customEdges, string>;

export type CustomEdge = {
  relationship: RelationshipFlowEdgeType;
}[CustomEdgeType];
