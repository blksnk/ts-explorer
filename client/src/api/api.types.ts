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

export type NodePackageId = number;

type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: ProjectId;
  name: string;
} & Timestamps;

export type ProjectDetails = {
  id: ProjectId;
  fileCount: number;
  nodeCount: number;
  fileImportCount: number;
};

export type File = {
  name: string;
  id: FileId;
  path: string;
  hash: string;
  projectId: ProjectId;
} & Timestamps;

export type FileRelationship = {
  from: FileId;
  to: FileId;
};

export type FileNode = {
  hash: string;
  end: number;
  id: NodeId;
  fileId: FileId;
  start: number;
  text: string;
  kind: number;
  parentId: Nullable<NodeId>;
} & Timestamps;

export type ProjectNodePackage = {
  id: NodePackageId;
  name: string;
  version: string;
  projectId: ProjectId;
} & Timestamps;

export type FileNodePackageImport = Pick<
  ProjectNodePackage,
  "id" | "name" | "version"
>;
