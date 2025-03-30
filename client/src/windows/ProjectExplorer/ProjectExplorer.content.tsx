import { customNodes, type WindowSlot } from "../../components";
import { useProjectExplorerContext } from "./ProjectExplorer.context";
import styled from "styled-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useResult } from "../../hooks";
import {
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlow,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ProOptions,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ProjectFile } from "../../api";
import { useProjectDetailsContext } from "../../pages/ProjectDetails/ProjectDetails.context";

const proOptions: ProOptions = {
  hideAttribution: true,
};

const NODE_LIMIT = 10;
const RANDOM_OFFSET = 1_000;

export const ProjectExplorerContent: WindowSlot = () => {
  const { files: filesResult, fileImports: fileImportsResult } =
    useProjectExplorerContext();
  const { setSelectedFile } = useProjectDetailsContext();

  const [files] = useResult(filesResult, []);
  const [fileImports] = useResult(fileImportsResult, []);
  const [nodes, setNodes] = useState<Node<ProjectFile, "file">[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const nodeIds = useMemo(() => nodes.map(({ id }) => id), [nodes]);
  useEffect(() => {
    if (files.length <= nodes.length) return;
    setNodes(
      files.slice(0, NODE_LIMIT).map(
        (file): Node<ProjectFile, "file"> => ({
          id: String(file.id),
          data: file,
          type: "file",
          position: {
            x: Math.random() * RANDOM_OFFSET,
            y: Math.random() * RANDOM_OFFSET,
          },
          origin: [0.5, 0.5],
        })
      )
    );
  }, [files, nodes.length]);

  useEffect(() => {
    if (fileImports.length <= edges.length || !nodes.length) return;
    setEdges(
      fileImports
        .filter(
          ({ importingFileId, importedFileId }) =>
            nodeIds.includes(String(importedFileId)) &&
            nodeIds.includes(String(importingFileId))
        )
        .map(
          (fileImport): Edge => ({
            id: String(fileImport.id),
            source: String(fileImport.importedFileId),
            target: String(fileImport.importingFileId),
            animated: true,
          })
        )
    );
  }, [fileImports, edges.length, nodes.length, nodeIds]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ProjectFile, "file">>[]) => {
      const selectionChanges = changes.filter(
        (change) => change.type === "select"
      );
      if (selectionChanges.length) {
        const selectedNodeId = selectionChanges.find(
          (change) => change.selected
        )?.id;
        setSelectedFile(selectedNodeId ? parseInt(selectedNodeId) : null);
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setSelectedFile]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <NodesContainer>
      <ReactFlow
        nodeTypes={customNodes}
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={proOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </NodesContainer>
  );
};

const NodesContainer = styled.div`
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
`;
