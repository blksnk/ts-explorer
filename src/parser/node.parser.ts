import type * as ts from "typescript";
import { hashNode, logger } from "../utils";
import type { NodeHash, SourceNode } from "../types";

/**
 * Recursively visits a TypeScript AST node and its children, collecting all nodes in a flat array
 * @param {ts.Node} node The TypeScript AST node to visit
 * @param {ts.SourceFile} sourceFile The source file containing the node
 * @param {Set<NodeHash>} [rootNodeHashes] A set of node hashes that are the root nodes of the file
 * @returns {SourceNode[]} An array containing the input node and all its descendant nodes
 */
export const visitNode = (
  node: ts.Node,
  sourceFile: ts.SourceFile,
  rootNodeHashes?: Set<NodeHash>
): SourceNode[] => {
  const hash = hashNode(node);
  const kind = node.kind;
  const start = node.getStart(sourceFile);
  const end = node.getEnd();
  const text = node.getText(sourceFile);

  const isRootFileNode = rootNodeHashes?.has(hash) ?? false;
  const parentHash = isRootFileNode ? null : hashNode(node.parent);

  const result: SourceNode[] = [
    { node, hash, start, end, text, kind, parentHash },
  ];
  if (!node.getChildCount()) {
    return result;
  }
  node.forEachChild((childNode) => {
    result.push(...visitNode(childNode, sourceFile, rootNodeHashes));
  });
  return result;
};
