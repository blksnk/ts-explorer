import {
  isObject,
  type Nullable,
  type Optional,
  type Predicate,
} from "@ubloimmo/front-util";
import type {
  FileHash,
  ResolverConfig,
  ProjectFile,
  ResolvedModule,
  SourceFile,
  TsConfig,
} from "../types";
import { parseSourceFile, resolveImportedModule } from "./file.parser";
import { Logger } from "@ubloimmo/front-util";

const logger = Logger();

/**
 * Recursively parses a source file and its imported modules into ProjectFile objects
 * @param {Nullable<SourceFile>} sourceFile - The source file to parse, or null
 * @param {Config} config - Configuration object containing parsing options
 * @returns {Promise<ProjectFile[]>} Array of ProjectFile objects containing the source file and its imports
 */
export const parseProjectFile = async (
  sourceFile: Nullable<SourceFile>,
  config: ResolverConfig & TsConfig,
  collectedHashes: Set<FileHash>
): Promise<ProjectFile[]> => {
  if (!sourceFile) {
    return [];
  }

  logger.log(
    `Parsing project file ${sourceFile.file.fileName}...`,
    "parseProjectFile"
  );
  // add current file to collected hashes to avoid circular dependencies
  collectedHashes.add(sourceFile.hash);
  // resolve imported modules names to their full file paths
  const resolvedModules = sourceFile.info.importedFiles
    .map(({ fileName }) => resolveImportedModule(sourceFile, fileName, config))
    .filter(isObject as Predicate<ResolvedModule>);
  // if no imported modules or disabled, return the source file
  if (!resolvedModules.length || !config.resolveImportedModules) {
    return [
      {
        sourceFile,
        imports: [],
      },
    ];
  }
  // recursively parse imported files
  const imports: FileHash[] = [];
  const importedFiles = await Promise.all(
    resolvedModules.map(async (resolvedModule) => {
      // skip external library imports if configured
      if (config.skipNodeModules && resolvedModule.isExternalLibraryImport) {
        logger.log(
          `Skipping external library import ${resolvedModule.resolvedFileName}`,
          "parseProjectFile"
        );
        return [];
      }
      // parse imported file
      const importedFile = await parseSourceFile(
        resolvedModule.resolvedFileName,
        config
      );
      // if file is parsed, add it to the imports and check for circular dependencies
      if (importedFile) {
        // mark this file as an import of the current file
        imports.push(importedFile.hash);
        // if file is already parsed, skip it
        if (collectedHashes.has(importedFile.hash)) {
          logger.log(
            `Skipping already parsed file ${importedFile.file.fileName}`,
            "parseProjectFile"
          );
          return [];
        }
        // add imported file to collected hashes to avoid circular dependencies
        collectedHashes.add(importedFile.hash);
      }
      // recursively parse imported file if not already parsed
      return await parseProjectFile(importedFile, config, collectedHashes);
    })
  );

  // create a map to store the project files
  let resultMap: Optional<Map<FileHash, ProjectFile>> = new Map();

  // add the source file to the result map
  resultMap.set(sourceFile.hash, {
    sourceFile,
    imports,
  });

  // add imported files to result map while ensuring no duplicates
  for (const importedFile of importedFiles.flat()) {
    if (!resultMap.has(importedFile.sourceFile.hash)) {
      resultMap.set(importedFile.sourceFile.hash, importedFile);
    }
  }
  // merge result to array
  const result = Array.from(resultMap.values());
  // free memory
  resultMap = undefined;
  // return the flattened unique project files
  return result;
};
