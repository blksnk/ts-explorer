import { NodeGraph, type WindowSlot } from "../../components";
import { useProjectExplorerContext } from "./ProjectExplorer.context";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";
import { useApi, type ProjectFile } from "../../api";
import { useProjectDetailsContext } from "../../pages/ProjectDetails/ProjectDetails.context";
import {
  GetInitialNodesFn,
  type AvailableNodeType,
} from "../../components/NodeGraph/NodeGraph.types";
import { isNull, type Nullable } from "@ubloimmo/front-util";

export const ProjectExplorerContent: WindowSlot = () => {
  const { id } = useProjectExplorerContext();
  const { setSelectedFile } = useProjectDetailsContext();

  const api = useApi();

  const getInitialNodes = useCallback<
    GetInitialNodesFn<number, ProjectFile>
  >(async () => {
    if (!id) return [];
    const entryPoints = await api.endpoints.project.entrypoints(id);
    if (!entryPoints.data) return [];
    return entryPoints.data.map((data) => ({
      data,
      type: "file",
    }));
  }, [api.endpoints.project, id]);

  const onNodeSelectionChange = useCallback(
    (fileId: Nullable<number>, nodeType: Nullable<AvailableNodeType>) => {
      if (isNull(fileId) || nodeType !== "file") return;
      setSelectedFile(fileId);
    },
    [setSelectedFile]
  );

  return (
    <NodeGraph
      getInitialNodes={getInitialNodes}
      initialEdges={[]}
      onNodeSelectionChange={onNodeSelectionChange}
    />
  );
};
