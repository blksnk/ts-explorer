import { cssPx, FlexColumnLayout } from "@ubloimmo/uikit";
import type { FileFlowNodeProps } from "./FileFlowNode.types";
import styled, { css } from "styled-components";
import { FileFlowNodeHeader } from "./FileFlowNode.header";
import { Handle, Position, useInternalNode } from "@xyflow/react";
import { useApi, type ProjectFile } from "../../../api";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { NodeLine } from "../../NodeLine";
import { useNodeGraphContext } from "../../NodeGraph";
import { computeRelativeNodeOffsets, NODE_WIDTH } from "./FileFlowNode.utils";

export const FileFlowNode = ({ data, selected, id }: FileFlowNodeProps) => {
  const api = useApi();
  const { addConnectedNodes } = useNodeGraphContext<
    number,
    ProjectFile,
    "file"
  >();

  const internalNode = useInternalNode(id);

  const importsFrom = useQuery({
    queryKey: api.queryKeys.file.imports(data.id),
    queryFn: () => api.endpoints.file.imports(data.id),
  });

  const importedBy = useQuery({
    queryKey: api.queryKeys.file.importedBy(data.id),
    queryFn: () => api.endpoints.file.importedBy(data.id),
  });

  const importsFromCount = useMemo(() => {
    return importsFrom.data?.data?.length ?? 0;
  }, [importsFrom.data]);

  const importedByFilesCount = useMemo(() => {
    return importedBy.data?.data?.length ?? 0;
  }, [importedBy.data]);

  const loadImportsFromNodes = useCallback(() => {
    if (!importsFrom.data?.data?.length || !internalNode) return;

    const relativeOffsets = computeRelativeNodeOffsets(
      importsFrom.data.data.length,
      internalNode.position,
      internalNode.measured.height,
      internalNode.measured.width,
      "right"
    );

    const nodeDefinitions = importsFrom.data.data.map((data, index) => ({
      data,
      type: "file" as const,
      position: relativeOffsets[index],
    }));
    addConnectedNodes(id, nodeDefinitions, "source");
  }, [addConnectedNodes, id, importsFrom.data, internalNode]);

  const loadImportsFromNodesOnClick = useMemo(
    () => (importsFromCount ? loadImportsFromNodes : null),
    [importsFromCount, loadImportsFromNodes]
  );

  const loadImportedByNodes = useCallback(() => {
    if (!importedBy.data?.data?.length || !internalNode) return;
    const relativeOffsets = computeRelativeNodeOffsets(
      importedBy.data.data.length,
      internalNode.position,
      internalNode.measured.height,
      internalNode.measured.width,
      "left"
    );

    const nodeDefinitions = importedBy.data.data.map((data, index) => ({
      data,
      type: "file" as const,
      position: relativeOffsets[index],
    }));
    addConnectedNodes(id, nodeDefinitions, "target");
  }, [addConnectedNodes, id, importedBy.data, internalNode]);

  const loadImportedByNodesOnClick = useMemo(
    () => (importedByFilesCount ? loadImportedByNodes : null),
    [importedByFilesCount, loadImportedByNodes]
  );

  return (
    <>
      <NodeContainer $selected={selected}>
        <FileFlowNodeHeader data={data} selected={selected} />
        {data.isEntrypoint && (
          <NodeLine
            icon="SquircleArrowBottom"
            label="Project entrypoint"
            active
          />
        )}
        {importedBy.isSuccess && !!importedByFilesCount && (
          <NodeLine
            icon="ArrowLeftShort"
            label={`Imported by ${importedByFilesCount} files`}
            onClick={loadImportedByNodesOnClick}
          >
            <HiddenHandle type="source" position={Position.Left} />
          </NodeLine>
        )}
        {importsFrom.isSuccess && !!importsFromCount && (
          <NodeLine
            icon="ArrowRightShort"
            label={`Imports from ${importsFromCount} files`}
            onClick={loadImportsFromNodesOnClick}
          >
            <HiddenHandle type="target" position={Position.Right} />
          </NodeLine>
        )}
      </NodeContainer>
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
  max-width: ${cssPx(NODE_WIDTH)};

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
