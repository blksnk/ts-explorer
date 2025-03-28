import * as ts from "typescript";
import * as bun from "bun";
import { hashFile, hashNode } from "../utils";
import { Logger, type Nullable, type Optional } from "@ubloimmo/front-util";
import type {
  ResolverConfig,
  ResolvedModule,
  SourceFile,
  SourceNode,
  TsConfig,
} from "../types";
import { visitNode } from "./node.parser";

const logger = Logger();

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

/**
 * Resolves an imported module name to its full file path using TypeScript's module resolution
 * @param {SourceFile} sourceFile - The source file containing the import
 * @param {string} moduleName - The name/path of the module to resolve
 * @param {Config} config - Configuration object containing TypeScript compiler options
 * @returns {Nullable<ResolvedModule>} The resolved module information or null if resolution fails
 */
export const resolveImportedModule = (
  sourceFile: SourceFile,
  moduleName: string,
  config: TsConfig
): Nullable<ResolvedModule> => {
  if (!config.tsConfig?.options) {
    logger.warn(
      "No tsconfig found, skipping import resolution",
      "resolveFileImport"
    );
    return null;
  }
  logger.debug(
    `Resolving imported module ${moduleName}...`,
    "resolveFileImport"
  );
  const resolved = ts.resolveModuleName(
    moduleName,
    sourceFile.file.fileName,
    config.tsConfig?.options,
    ts.sys
  );
  if (!resolved.resolvedModule) {
    logger.debug(`Could not resolve module ${moduleName}`, "resolveFileImport");
    return null;
  }
  logger.debug(
    `Resolved to ${resolved.resolvedModule.resolvedFileName}`,
    "resolveFileImport"
  );
  return resolved.resolvedModule;
};

export const parseSourceFile = async (
  fileName: string,
  config: ResolverConfig
): Promise<Nullable<SourceFile>> => {
  try {
    // get file handle
    const fileHandle = bun.file(fileName);
    // check if file exists
    const exists = await fileHandle.exists();
    if (!exists) {
      logger.warn(`File ${fileName} does not exist`, "getSourceFile");
      return null;
    }
    // get file content and ensure it's not empty
    const content = await fileHandle.text();
    if (!content.length) {
      logger.debug(`File ${fileName} is empty`, "getSourceFile");
      return null;
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
    // get nodes if resolveFileNodes is true
    const nodes = config?.resolveFileNodes ? getSourceFileNodes(file) : [];
    // return it
    return {
      file,
      info,
      hash,
      nodes,
    };
  } catch (error) {
    logger.error(error, "getSourceFile");
    return null;
  }
};
