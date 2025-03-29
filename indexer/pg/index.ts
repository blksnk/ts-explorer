import {
  isObject,
  isString,
  type Nullable,
  type Predicate,
} from "@ubloimmo/front-util";
import type {
  AdapterType,
  ParserMaps,
  SourceNode,
  StaticConfig,
} from "../../parser/types";
import { mapValues } from "../indexer.utils";
import { deleteFilesIn, indexFiles } from "./file.indexer";
import { indexProject } from "./project.indexer";
import { formatNodeInput, indexNodeParent, indexNodes } from "./node.indexer";
import type {
  FileContentInput,
  FileContentOutput,
  FileImportInput,
  FileImportOutput,
  FileOutput,
  NodeOutput,
} from "../../db";
import { indexFileImports } from "./fileImport.indexer";
import { Logger } from "@ubloimmo/front-util";
import {
  formatFileContentInput,
  indexFileContents,
} from "./fileContent.indexer";

const logger = Logger();

/**
 * Indexes all files in a project by inserting them into the database
 * @param {string} projectId - The ID of the project these files belong to
 * @param {ParserMaps} parserMaps - Parser maps containing files to index
 * @returns {Promise<Nullable<FileOutput[]>>} Array of indexed files if successful, null if failed
 */
const indexProjectFiles = async (
  projectId: string,
  parserMaps: ParserMaps
): Promise<Nullable<FileOutput[]>> => {
  // index project files
  const files = mapValues(parserMaps.files);
  const projectFiles = await indexFiles(files, projectId);
  logger.log(
    `Indexed ${projectFiles ? projectFiles.length : "no"} project files`,
    "indexProjectFiles"
  );
  return projectFiles;
};

/**
 * Indexes all nodes in a project by inserting them into the database and establishing parent-child relationships
 * @param {FileOutput[]} projectFiles - Array of indexed file records to associate nodes with
 * @param {CompleteParserConfig} config - Configuration object containing project settings
 * @param {ParserMaps} parserMaps - Parser maps containing nodes and their relationships
 * @returns {Promise<NodeOutput[]>} Array of indexed node records
 */
const indexProjectNodes = async (
  projectFiles: FileOutput[],
  parserMaps: ParserMaps
): Promise<NodeOutput[]> => {
  if (!projectFiles.length) return [];
  // map nodes to their files, constructing node inputs
  const nodeInputs = projectFiles.flatMap(({ id, hash }) => {
    return (
      parserMaps.fileNodes
        .get(hash)
        ?.map((nodeHash) => parserMaps.nodes.get(nodeHash)) ?? []
    )
      .filter(isObject as Predicate<SourceNode>)
      .map((node) => formatNodeInput(node, id));
  });
  // break if no nodes are to be indexed
  if (!nodeInputs.length) return [];
  // index nodes
  const projectNodes = await indexNodes(nodeInputs);
  logger.log(
    `Indexed ${projectNodes?.length ?? 0} project nodes`,
    "indexProjectNodes"
  );
  if (!projectNodes?.length) return [];
  // iterate through project nodes to update their parent nodes
  // await Promise.all(
  //   projectNodes.map(async ({ id, hash }) => {
  //     const parentHash = parserMaps.nodeParents.get(hash);
  //     if (!parentHash) return false;
  //     const parentNodeId = projectNodes.find(
  //       ({ hash }) => hash === parentHash
  //     )?.id;
  //     if (!parentNodeId) return false;
  //     await indexNodeParent(id, parentNodeId);
  //     return true;
  //   })
  // );
  // logger.log(
  //   `Wrote parent-child relationships for ${projectNodes.length} project nodes`,
  //   "indexProjectNodes"
  // );
  return projectNodes;
};

/**
 * Indexes all file imports in a project by creating relationships between importing and imported files
 * @param {FileOutput[]} projectFiles - Array of indexed file records to establish import relationships between
 * @param {ParserMaps} parserMaps - Parser maps containing file import relationships
 * @returns {Promise<Nullable<FileImportOutput[]>>} Array of indexed file import records if successful, null if failed
 */
const indexProjectFileImports = async (
  projectFiles: FileOutput[],
  parserMaps: ParserMaps
): Promise<Nullable<FileImportOutput[]>> => {
  if (!projectFiles.length) return [];
  // map file imports t their importing and imported files
  const inputs: FileImportInput[] = projectFiles.flatMap(({ id, hash }) => {
    const importedFileHashes = parserMaps.imports.get(hash) ?? [];
    return importedFileHashes
      .map((importedFileHash): Nullable<FileImportInput> => {
        const importedFileId = projectFiles.find(
          ({ hash }) => hash === importedFileHash
        )?.id;
        if (!importedFileId) return null;
        return { importingFileId: id, importedFileId };
      })
      .filter(isObject as Predicate<FileImportInput>);
  });
  if (!inputs.length) return [];
  const projectFileImports = await indexFileImports(inputs);
  logger.log(
    `Indexed ${
      projectFileImports ? projectFileImports.length : "no"
    } project file imports`,
    "indexProjectFileImports"
  );
  return projectFileImports;
};

/**
 * Indexes file contents for all project files by creating database records
 * @param {FileOutput[]} projectFiles - Array of indexed file records to store contents for
 * @param {ParserMaps} parserMaps - Parser maps containing file contents mapped to file hashes
 * @returns {Promise<Nullable<FileContentOutput[]>>} Array of indexed file content records if successful, null if failed
 */
const indexProjectFileContents = async (
  projectFiles: FileOutput[],
  parserMaps: ParserMaps
): Promise<Nullable<FileContentOutput[]>> => {
  if (!projectFiles.length) return [];
  const fileContentInputs = projectFiles
    .map(({ id, hash }) => {
      const content = parserMaps.files.get(hash)?.content ?? null;
      if (!isString(content)) return null;
      return formatFileContentInput(id, content);
    })
    .filter(isObject as Predicate<FileContentInput>);

  const fileContents = await indexFileContents(fileContentInputs);
  logger.log(
    `Indexed ${fileContents ? fileContents.length : "no"} file contents`,
    "indexProjectFileContents"
  );
  return fileContents;
};

/**
 * Indexes a project by creating database records for the project, its files, nodes and their relationships
 * @param {StaticConfig<AdapterType>} config - Configuration object containing project details and indexing options
 * @param {ParserMaps} parserMaps - Parser maps containing files, nodes and their relationships to index
 * @returns {Promise<boolean>} True if indexing was successful, false otherwise
 */
export const index = async (
  config: StaticConfig<AdapterType>,
  parserMaps: ParserMaps
): Promise<boolean> => {
  // index project
  const project = await indexProject(config);

  // return if project indexing failed
  if (!project) {
    logger.warn("Failed to index project, aborting", "index");
    return false;
  }
  logger.log(`Indexed project ${config.projectName} (${project.id})`, "index");

  // clear project files before indexing
  await deleteFilesIn(project.id);

  // index project files
  const projectFiles = await indexProjectFiles(project.id, parserMaps);

  // return if no files were indexed
  if (!projectFiles?.length) return true;

  // index project file contents
  await indexProjectFileContents(projectFiles, parserMaps);

  // index project file imports
  if (config.resolveImportedModules) {
    await indexProjectFileImports(projectFiles, parserMaps);
  }

  // index project nodes if file nodes are resolved
  if (config.resolveFileNodes) {
    await indexProjectNodes(projectFiles, parserMaps);
  }
  return true;
};
