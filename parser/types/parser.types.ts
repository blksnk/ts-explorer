import type { Nullable } from "@ubloimmo/front-util";
import * as ts from "typescript";

export type Hash = string;
export type FileHash = Hash;
export type NodeHash = Hash;
export type PackageName = string;

export type SourceNode = {
  hash: NodeHash;
  start: number;
  end: number;
  text: string;
  parentHash: Nullable<NodeHash>;
  kind: ts.SyntaxKind;
};

export type SourceFile = {
  fileName: string;
  info: ts.PreProcessedFileInfo;
  hash: FileHash;
  nodes: SourceNode[];
  content: string;
  isEntrypoint?: boolean;
};

export type ResolvedModule = ts.ResolvedModuleFull;

export type NodePackage = {
  name: PackageName;
  version: string;
};

export type ProjectFile = {
  sourceFile: SourceFile;
  imports: FileHash[];
  packageImports: PackageName[];
};

export type SourceFileInput = Omit<SourceFile, "nodes">;

/**
 * Maps a file hash to an array of file hashes that it imports
 */
export type SourceFileImportMap = Map<FileHash, FileHash[]>;

/**
 * Maps a file hash to the file object without nodes
 */
export type SourceFileMap = Map<FileHash, SourceFileInput>;

/**
 * Maps a node hash to the node object
 */
export type SourceNodeMap = Map<NodeHash, SourceNode>;

/**
 * Maps a file hash to an array of node hashes that it contains
 */
export type SourceFileNodeMap = Map<FileHash, NodeHash[]>;

/**
 * Maps a node hash to the hash of the node that is its parent
 */
export type SourceNodeParentMap = Map<NodeHash, NodeHash>;

/**
 * Maps a package name to the package object
 */
export type NodePackageMap = Map<PackageName, NodePackage>;

/**
 * Maps a file hash to an array of package names that it imports
 */
export type SourceFileNodePackageMap = Map<FileHash, PackageName[]>;

/**
 * A data structure that stores all parsed files, nodes, and their relationships
 */
export type ParserMaps = {
  /**
   * Maps a file hash to an array of file hashes that it imports
   */
  imports: SourceFileImportMap;
  /**
   * Maps a file hash to the file object without nodes
   */
  files: SourceFileMap;
  /**
   * Maps a node hash to the node object
   */
  nodes: SourceNodeMap;
  /**
   * Maps a file hash to an array of node hashes that it contains
   */
  fileNodes: SourceFileNodeMap;
  /**
   * Maps a node hash to the hash of the node that is its parent
   */
  nodeParents: SourceNodeParentMap;
  /**
   * Maps a package name to the package object
   */
  packages: NodePackageMap;
  /**
   * Maps a file hash to an array of package names that it imports
   */
  filePackages: SourceFileNodePackageMap;
};
