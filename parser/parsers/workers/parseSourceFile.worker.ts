import * as ts from "typescript";
import type { ParseSourceFileWorker, SourceNode } from "../../types";
import * as bun from "bun";
import { hashFile, hashNode } from "../../utils";
import type { Optional } from "@ubloimmo/front-util";
import { visitNode } from "../node.parser";

declare var self: Worker;

const postResult = <T>(result: T): T => {
  self.postMessage(result);
  return result;
};

/**
 * Extracts all nodes from a TypeScript source file by recursively visiting each child node
 * @param file The TypeScript source file to process
 * @returns An array of SourceNode objects containing each node and its hash
 */
const getSourceFileNodes = (file: ts.SourceFile): SourceNode[] => {
  const nodes: SourceNode[] = [];
  let rootNodeHashes: Optional<Set<string>> = new Set(
    file.getChildren().map(hashNode)
  );
  file.forEachChild((child) => {
    nodes.push(...visitNode(child, file, rootNodeHashes));
  });
  // free memory
  rootNodeHashes = undefined;
  return nodes;
};

self.onmessage = async (
  event: MessageEvent<ParseSourceFileWorker.WorkerData>
): Promise<ParseSourceFileWorker.WorkerResponse> => {
  try {
    const { fileName, config, isEntrypoint = false } = event.data;
    // get file handle
    const fileHandle = bun.file(fileName);
    // check if file exists
    const exists = await fileHandle.exists();
    if (!exists) {
      return postResult(null);
    }
    // get file content and ensure it's not empty
    const content = await fileHandle.text();
    if (!content.length) {
      return postResult(null);
    }
    // create source file
    const file = ts.createSourceFile(
      fileName,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    // preprocess file to get imports
    const info = ts.preProcessFile(content, true, true);
    // get hash
    const hash = hashFile(fileName, content);
    const nodes = config?.resolveFileNodes ? getSourceFileNodes(file) : [];
    // return it
    return postResult<ParseSourceFileWorker.WorkerResult>({
      fileName: file.fileName,
      info,
      hash,
      nodes,
      content,
      isEntrypoint,
    });
  } catch (error) {
    console.error(error);
    return postResult<ParseSourceFileWorker.WorkerError>(null);
  }
};
