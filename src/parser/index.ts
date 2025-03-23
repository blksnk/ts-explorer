import type {
  Config,
  Hash,
  NodeHash,
  ParserMaps,
  ProjectFile,
  SourceFile,
  SourceFileMap,
  SourceNodeMap,
} from "../types";
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

export const parse = async (config: Config) => {
  const parserMaps = initParserMaps();
  const entryFile = await parseSourceFile(config.entryPoint, config);

  if (!entryFile) {
    logger.error("Entry file not found", "parse");
    return;
  }
  const projectFiles = await parseProjectFile(entryFile, config);
  projectFiles.forEach((projectFile) => {
    declareProjectFile(parserMaps, projectFile);
  });
  logger.warn(parserMaps);
  // logger.debug(sourceFile?.nodes);
};
