import { isObject, type Nullable, type Predicate } from "@ubloimmo/front-util";
import type {
  Config,
  FileHash,
  ProjectFile,
  ResolvedModule,
  SourceFile,
} from "../types";
import { parseSourceFile, resolveImportedModule } from "./file.parser";
import { logger } from "../utils";

/**
 * Recursively parses a source file and its imported modules into ProjectFile objects
 * @param {Nullable<SourceFile>} sourceFile - The source file to parse, or null
 * @param {Config} config - Configuration object containing parsing options
 * @returns {Promise<ProjectFile[]>} Array of ProjectFile objects containing the source file and its imports
 */
export const parseProjectFile = async (
  sourceFile: Nullable<SourceFile>,
  config: Config
): Promise<ProjectFile[]> => {
  if (!sourceFile) {
    return [];
  }
  // resolve imported modules names to their full file paths
  const resolvedModules = sourceFile.info.importedFiles
    .map(({ fileName }) => resolveImportedModule(sourceFile, fileName, config))
    .filter(isObject as Predicate<ResolvedModule>);

  logger.debug(`resolving project file ${sourceFile.file.fileName}`);

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
      if (config.skipNodeModules && resolvedModule.isExternalLibraryImport) {
        logger.debug(
          `Skipping external library import ${resolvedModule.resolvedFileName}`,
          "parseProjectFile"
        );
        return [];
      }
      const importedFile = await parseSourceFile(
        resolvedModule.resolvedFileName,
        config
      );
      if (importedFile) {
        imports.push(importedFile.hash);
      }
      return await parseProjectFile(importedFile, config);
    })
  );

  // create a map to store the project files
  const resultMap = new Map<FileHash, ProjectFile>();

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

  // return the flattened unique project files
  return Array.from(resultMap.values());
};
