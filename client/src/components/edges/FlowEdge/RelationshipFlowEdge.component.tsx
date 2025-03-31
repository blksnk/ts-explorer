import { BaseEdge, getSmoothStepPath } from "@xyflow/react";
import type { RelationshipFlowEdgeProps } from "./RelationshipFlowEdge.types";
import styled, { css } from "styled-components";
import { cssVarUsage, type ColorKey, type PaletteColor } from "@ubloimmo/uikit";

export const RelationshipFlowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  selected,
  data,
}: RelationshipFlowEdgeProps) => {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 24,
  });
  return (
    <StyledEdge
      id={id}
      path={path}
      label={label}
      color="red"
      $warning={data?.isWarning}
      $selected={selected}
      strokeDasharray={8}
    />
  );
};

const StyledEdge = styled(BaseEdge)<{
  $selected?: boolean;
  $warning?: boolean;
}>`
  ${({ $selected, $warning }) => {
    const baseColor: Exclude<ColorKey, "gray"> = $warning
      ? "warning"
      : "primary";
    const color: PaletteColor = `${baseColor}-${$selected ? "base" : "medium"}`;
    const strokeWidth = $selected ? 2 : 1;
    const zIndex = $selected ? 2 : 1;
    return css`
      stroke: ${cssVarUsage(color)} !important;
      stroke-width: ${strokeWidth};

      svg:has(> g > &) {
        z-index: ${zIndex} !important;
      }
    `;
  }}
`;
