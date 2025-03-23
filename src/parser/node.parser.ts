import type * as ts from "typescript";
import { hashNode } from "../utils";
import type { SourceNode } from "../types";

/**
 * Recursively visits a TypeScript AST node and its children, collecting all nodes in a flat array
 * @param node The TypeScript AST node to visit
 * @returns An array containing the input node and all its descendant nodes
 */
export const visitNode = (node: ts.Node): SourceNode[] => {
  const hash = hashNode(node);
  const result: SourceNode[] = [{ node, hash }];
  if (!node.getChildCount()) {
    return result;
  }
  node.forEachChild((childNode) => {
    result.push(...visitNode(childNode));
  });
  return result;
};
