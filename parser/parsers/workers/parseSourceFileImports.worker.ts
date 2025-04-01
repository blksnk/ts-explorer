import { isObject, type Nullable, type Predicate } from "@ubloimmo/front-util";
import type {
  FileHash,
  NodePackage,
  PackageName,
  ParseSourceFileImportsWorker,
  ResolvedModule,
  ResolverConfig,
  SourceFile,
} from "../../types";
import { resolveImportedModule } from "../file.parser";
import { initWorker, workerPromise } from "../../utils";

declare var self: Worker;

const postResult = <T>(result: T) => {
  self.postMessage(result);
};

// initialize nested worker, used for all imported files of the current job
const parseSourceFileWorker = initWorker(
  new URL("./parseSourceFile.worker.ts", import.meta.url)
);

self.onmessage = async (
  event: MessageEvent<ParseSourceFileImportsWorker.WorkerData>
) => {
  const { jobId } = event.data;
  try {
    const { sourceFile, uniqueFileHashes, uniquePackageNames, config } =
      event.data;
    // main thread data
    const uniquePackages: Set<PackageName> = new Set(uniquePackageNames);
    const uniqueFiles: Set<FileHash> = new Set(uniqueFileHashes);

    // worker data
    const fileImports: Set<FileHash> = new Set();
    const packageImports: Set<PackageName> = new Set();
    const newFilesMap: Map<FileHash, SourceFile> = new Map();
    const newPackagesMap: Map<PackageName, NodePackage> = new Map();

    // resolve imported modules names to their full file paths
    const resolvedModules = sourceFile.info.importedFiles
      .map(({ fileName }) =>
        resolveImportedModule(sourceFile, fileName, config)
      )
      .filter(isObject as Predicate<ResolvedModule>);

    // parse imported files
    for (const resolvedModule of resolvedModules) {
      // register external library imports
      if (resolvedModule.isExternalLibraryImport) {
        registerNodePackage: {
          // extract package name and version, break if not found
          let name = resolvedModule.packageId?.name;
          const version = resolvedModule.packageId?.version;
          if (!name || !version) break registerNodePackage;
          // remove `@types/` from name if present
          // ex: @types/react -> react
          name = name.replace(/^@types\//, "");
          // create package object
          const packageImport: NodePackage = {
            name,
            version,
          };

          // add package to unique packages if not already present
          if (!uniquePackages.has(packageImport.name)) {
            newPackagesMap.set(packageImport.name, packageImport);
          }
          // add package to package imports
          packageImports.add(packageImport.name);
        }

        // skip external library imports if configured
        if (config.skipNodeModules) continue;
      }
      // parse imported file
      const importedFile = await workerPromise<
        Nullable<SourceFile>,
        {
          fileName: string;
          config: ResolverConfig;
        }
      >(parseSourceFileWorker, {
        fileName: resolvedModule.resolvedFileName,
        config,
      });
      // if file is not parsed, skip it
      if (!importedFile) continue;
      // mark this file as an import of the current file
      fileImports.add(importedFile.hash);
      // skip already parsed files
      if (uniqueFiles.has(importedFile.hash)) continue;
      // declare this new file as parsed
      newFilesMap.set(importedFile.hash, importedFile);
    }
    return postResult<ParseSourceFileImportsWorker.WorkerResult>({
      type: "result",
      jobId,
      fileImports: Array.from(fileImports),
      packageImports: Array.from(packageImports),
      newFiles: Array.from(newFilesMap.values()),
      newPackages: Array.from(newPackagesMap.values()),
      sourceFile,
    });
  } catch (error) {
    console.error(error);
    return postResult<ParseSourceFileImportsWorker.WorkerError>({
      type: "error",
      jobId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
