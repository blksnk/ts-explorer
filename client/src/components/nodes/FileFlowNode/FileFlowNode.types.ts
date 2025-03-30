import type { ProjectFile } from "../../../api";
import type { Node, NodeProps } from "@xyflow/react";

export type FileFlowNodeType = Node<ProjectFile, "file">;

export type FileFlowNodeProps = NodeProps<FileFlowNodeType>;

export type FileFlowNodeHeaderProps = Pick<
  FileFlowNodeProps,
  "data" | "selected"
>;
