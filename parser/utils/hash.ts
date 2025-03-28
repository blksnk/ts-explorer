import { createHash } from "node:crypto";
import type * as ts from "typescript";

/**
 * Creates a SHA-256 hash of the provided string data
 * @param data The string to hash
 * @returns The hex-encoded SHA-256 hash of the input data
 */
export const hash = (data: string) => {
  const hasher = createHash("sha256");
  hasher.update(data);
  return hasher.digest("hex");
};

/**
 * Creates a SHA-256 hash of a file by combining its name and content
 * @param fileName The name of the file
 * @param fileContent The content of the file as a string
 * @returns The hex-encoded SHA-256 hash of the combined file name and content
 */
export const hashFile = (fileName: string, fileContent: string) => {
  return hash(fileName.concat(":", fileContent));
};

/**
 * Creates a SHA-256 hash of a TypeScript AST node's text content
 * @param node The TypeScript AST node to hash
 * @returns The hex-encoded SHA-256 hash of the node's text content
 */
export const hashNode = (node: ts.Node) => {
  const hashValues = [
    node.kind,
    node.getFullText(),
    node.getStart(),
    node.getEnd(),
    node.flags,
  ].join(":");
  return hash(hashValues);
};
