import type { Config, NodeHash, ParserMaps, ProjectFile } from "../types";
import { logger } from "../utils";
import { parseSourceFile } from "./file.parser";
import { parseProjectFile } from "./project.parser";

/**
 * Initializes the parser maps data structure used to store files, nodes, and their relationships
 * @returns {ParserMaps} A new ParserMaps object with empty maps for files, nodes, file-node relationships, and imports
 */
const initParserMaps = (): ParserMaps => {
  return {
    files: new Map(),
    nodes: new Map(),
    fileNodes: new Map(),
    imports: new Map(),
  };
};

/**
 * Declares a source file and its nodes in the parser maps data structure
 * @param {ParserMaps} parserMaps - The parser maps object to update
 * @param {SourceFile} sourceFile - The source file to declare, containing nodes and file metadata
 */
const declareProjectFile = (
  parserMaps: ParserMaps,
  { sourceFile: { nodes, ...sourceFile }, imports }: ProjectFile
) => {
  parserMaps.files.set(sourceFile.hash, sourceFile);
  const nodeHashes: NodeHash[] = [];
  nodes.forEach((node) => {
    parserMaps.nodes.set(node.hash, node);
    nodeHashes.push(node.hash);
  });
  parserMaps.fileNodes.set(sourceFile.hash, nodeHashes);
  parserMaps.imports.set(sourceFile.hash, imports);
};

/**
 * Parses a TypeScript project starting from the entry point specified in the configuration
 * Traverses the project's file structure, collecting files, nodes, and their relationships
 * @param {Config} config - Configuration object containing project settings and entry point
 * @returns {Promise<ParserMaps>} Parser maps containing collected files, nodes, and relationships
 */
export const parse = async (config: Config): Promise<ParserMaps> => {
  logger.info("Begin parsing project...", "parse");
  const start = performance.now();
  const parserMaps = initParserMaps();
  const entryFile = await parseSourceFile(config.entryPoint, config);

  if (!entryFile) {
    logger.error("Entry file not found, aborting", "parse");
    return parserMaps;
  }
  const projectFiles = await parseProjectFile(entryFile, config, new Set());
  projectFiles.forEach((projectFile) => {
    declareProjectFile(parserMaps, projectFile);
  });
  const end = performance.now();
  logger.info(`${end - start}ms`, "took");
  logger.log(parserMaps.files.size, "files parsed");
  logger.log(parserMaps.nodes.size, "nodes parsed");
  logger.log(parserMaps.fileNodes.size, "file nodes parsed");
  logger.log(parserMaps.imports.size, "imports parsed");
  return parserMaps;
};
