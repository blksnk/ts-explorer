import type { Optional } from "@ubloimmo/front-util";
import { arrayOf, type DirectionHorizontal } from "@ubloimmo/uikit";
import type { NodePosition } from "../../NodeGraph";

const NODE_SPACING = 100;
export const NODE_WIDTH = 320;
const NODE_HEIGHT = 100;

export const computeRelativeNodeOffsets = (
  nodeCount: number,
  rootNodePosition: Required<NodePosition>,
  rootNodeHeight?: Optional<number>,
  _rootNodeWidth?: Optional<number>,
  direction: DirectionHorizontal = "right",
  spacing: number = NODE_SPACING
): NodePosition[] => {
  if (!nodeCount) return [];

  const nodeHeight = rootNodeHeight ?? NODE_HEIGHT;
  const nodeWidth = NODE_WIDTH;

  const offsetX = rootNodePosition.x + nodeWidth + spacing;
  const offsetCount = Math.max(nodeCount - 1, 0);
  const offsetY =
    offsetCount * nodeHeight + Math.max(offsetCount - 1, 0) * spacing;

  const originX =
    direction === "right" ? offsetX : rootNodePosition.x - nodeWidth - spacing;

  return arrayOf(nodeCount, (i) => ({
    x: originX,
    y: rootNodePosition.y + i * (spacing + NODE_HEIGHT) - offsetY / 2,
  }));
};
