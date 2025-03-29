import type { Nullable } from "@ubloimmo/front-util";
import * as ts from "typescript";

export type Hash = string;
export type FileHash = Hash;
export type NodeHash = Hash;

export type SourceNode = {
  node: ts.Node;
  hash: NodeHash;
  start: number;
  end: number;
  text: string;
  parentHash: Nullable<NodeHash>;
  kind: ts.SyntaxKind;
};

export type SourceFile = {
  file: ts.SourceFile;
  info: ts.PreProcessedFileInfo;
  hash: FileHash;
  nodes: SourceNode[];
  content: string;
};

export type ResolvedModule = ts.ResolvedModuleFull;

export type ProjectFile = {
  sourceFile: SourceFile;
  imports: FileHash[];
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
};
