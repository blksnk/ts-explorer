import * as ts from "typescript";
import { hashNode, initWorker, workerPromise } from "../utils";
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
  // logger.debug(
  //   `Resolving imported module ${moduleName}...`,
  //   "resolveFileImport"
  // );
  const resolved = ts.resolveModuleName(
    moduleName,
    sourceFile.fileName,
    config.tsConfig?.options,
    ts.sys
  );
  if (!resolved.resolvedModule) {
    logger.warn(`Could not resolve module ${moduleName}`, "resolveFileImport");
    return null;
  }
  // logger.debug(
  //   `Resolved to ${resolved.resolvedModule.resolvedFileName}`,
  //   "resolveFileImport"
  // );
  return resolved.resolvedModule;
};

/**
 * Parses a source file and returns information about it
 * @param {string} fileName - Path to the file to parse
 * @param {ResolverConfig} config - Configuration object for resolving file nodes
 * @returns {Promise<Nullable<SourceFile>>} Object containing file information or null if parsing fails
 */
export const parseSourceFile = async (
  fileName: string,
  config: ResolverConfig,
  isEntrypoint: boolean = false
): Promise<Nullable<SourceFile>> => {
  return await workerPromise<
    Nullable<SourceFile>,
    {
      fileName: string;
      config: ResolverConfig;
      isEntrypoint?: boolean;
    }
  >(
    initWorker(new URL("./workers/parseSourceFile.worker.ts", import.meta.url)),
    {
      fileName,
      config,
      isEntrypoint,
    },
    true
  );
};
