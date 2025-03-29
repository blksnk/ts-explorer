import type {
  CompleteParserConfig,
  FileHash,
  NodeHash,
  ParserMaps,
  ProjectFile,
  SourceFile,
} from "../types";
import { parseSourceFile } from "./file.parser";
import { parseProjectFile } from "./projectFile.parser";
import { isObject, Logger, type Predicate } from "@ubloimmo/front-util";

const logger = Logger();

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
    nodeParents: new Map(),
    packages: new Map(),
    filePackages: new Map(),
  };
};

/**
 * Declares a source file and its nodes in the parser maps data structure
 * @param {ParserMaps} parserMaps - The parser maps object to update
 * @param {SourceFile} sourceFile - The source file to declare, containing nodes and file metadata
 */
const declareProjectFile = (
  parserMaps: ParserMaps,
  { sourceFile: { nodes, ...sourceFile }, imports, packageImports }: ProjectFile
) => {
  parserMaps.files.set(sourceFile.hash, sourceFile);
  const nodeHashes: NodeHash[] = [];
  nodes.forEach((node) => {
    parserMaps.nodes.set(node.hash, node);
    nodeHashes.push(node.hash);
    if (node.parentHash) parserMaps.nodeParents.set(node.hash, node.parentHash);
  });
  parserMaps.fileNodes.set(sourceFile.hash, nodeHashes);
  parserMaps.imports.set(sourceFile.hash, imports);
  parserMaps.filePackages.set(sourceFile.hash, packageImports);
};

/**
 * Parses a TypeScript project starting from the entry point specified in the configuration
 * Traverses the project's file structure, collecting files, nodes, and their relationships
 * @param {CompleteParserConfig} config - Configuration object containing project settings and entry point
 * @returns {Promise<ParserMaps>} Parser maps containing collected files, nodes, and relationships
 */
export const parseProject = async (
  config: CompleteParserConfig<"local">
): Promise<ParserMaps> => {
  logger.info("Begin parsing project...", "parse");
  const start = performance.now();
  const parserMaps = initParserMaps();
  const entryFiles = (
    await Promise.all(
      config.adapter.entryPoints.map(
        async (entryPoint) => await parseSourceFile(entryPoint, config)
      )
    )
  ).filter(isObject as Predicate<SourceFile>);

  if (!entryFiles.length) {
    logger.error("Entry files not found, aborting", "parse");
    return parserMaps;
  }
  const fileHashes = new Set<FileHash>();
  const uniqueProjectFiles: ProjectFile[] = [];
  // parse each entry file sequentially
  for (const entryFile of entryFiles) {
    logger.log(`Parsing entry file ${entryFile.file.fileName}...`, "parse");
    const projectFiles = await parseProjectFile(
      entryFile,
      config,
      fileHashes,
      parserMaps.packages
    );
    uniqueProjectFiles.push(...projectFiles);
  }
  uniqueProjectFiles.forEach((projectFile) => {
    declareProjectFile(parserMaps, projectFile);
  });
  const end = performance.now();
  logger.info(`${end - start}ms`, "took");
  logger.log(parserMaps.files.size, "files parsed");
  logger.log(parserMaps.nodes.size, "nodes parsed");
  logger.log(parserMaps.fileNodes.size, "file nodes parsed");
  logger.log(parserMaps.imports.size, "imports parsed");
  logger.log(parserMaps.packages.size, "unique imported packages parsed");
  logger.log(parserMaps.filePackages.size, "file packages parsed");
  logger.log(parserMaps.packages, "packages");
  return parserMaps;
};
