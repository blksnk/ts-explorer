import { FlexColumnLayout } from "@ubloimmo/uikit";
import type { FileFlowNodeProps } from "./FileFlowNode.types";
import styled, { css } from "styled-components";
import { FileFlowNodeHeader } from "./FileFlowNode.header";
import { Handle, Position } from "@xyflow/react";

export const FileFlowNode = ({ data, selected }: FileFlowNodeProps) => {
  console.log(data);
  return (
    <>
      <NodeContainer $selected={selected}>
        <FileFlowNodeHeader data={data} selected={selected} />
      </NodeContainer>
      <HiddenHandle type="source" position={Position.Top} />
      <HiddenHandle type="target" position={Position.Bottom} />
    </>
  );
};

const NodeContainer = styled(FlexColumnLayout)<{ $selected?: boolean }>`
  background: var(--white);
  border-top-left-radius: var(--s-2);
  border-top-right-radius: var(--s-2);
  border-bottom-left-radius: var(--s-3);
  border-bottom-right-radius: var(--s-3);
  display: flex;
  flex-direction: column;
  gap: calc(var(--s-05) * 0.5);
  background: var(--primary-light);
  overflow: hidden;
  max-width: 25rem;

  outline: 1px solid var(--primary-light);
  box-shadow: var(--shadow-card-elevation-low);

  ${({ $selected }) =>
    $selected &&
    css`
      outline-color: var(--primary-medium);
      box-shadow: var(--shadow-card-elevation-medium);
    `}
`;

const HiddenHandle = styled(Handle)`
  opacity: 0;
`;
