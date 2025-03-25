import type { Nullable } from "@ubloimmo/front-util";

export type Result<T> =
  | {
      data: T;
      error: never;
    }
  | {
      error: string;
      data: never;
    };

export type ApiResponse<T> = Result<T>;

export type ProjectId = string;

export type FileId = number;

export type NodeId = number;

export type Project = {
  id: ProjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectDetails = {
  id: ProjectId;
  fileCount: number;
  nodeCount: number;
  fileImportCount: number;
};

export type File = {
  name: string;
  id: FileId;
  createdAt: Date;
  updatedAt: Date;
  path: string;
  hash: string;
  projectId: ProjectId;
};

export type FileRelationship = {
  from: FileId;
  to: FileId;
};

export type FileNode = {
  hash: string;
  end: number;
  id: NodeId;
  createdAt: Date;
  updatedAt: Date;
  fileId: FileId;
  start: number;
  text: string;
  kind: number;
  parentId: Nullable<NodeId>;
};
