import type { ResolverConfig, TsConfig } from "./config.types";
import type {
  FileHash,
  NodePackage,
  PackageName,
  SourceFile,
} from "./parser.types";

export namespace ParseSourceFileImportsWorker {
  export type WorkerData = {
    jobId: number;
    sourceFile: SourceFile;
    uniqueFileHashes: FileHash[];
    uniquePackageNames: PackageName[];
    config: ResolverConfig & TsConfig;
  };

  export type WorkerResult = {
    type: "result";
    jobId: number;
    sourceFile: SourceFile;
    fileImports: FileHash[];
    packageImports: PackageName[];
    newFiles: SourceFile[];
    newPackages: NodePackage[];
  };

  export type WorkerError = {
    type: "error";
    jobId: number;
    error: string;
  };

  export type WorkerResponse = WorkerResult | WorkerError;
}

export namespace ParseSourceFileWorker {
  export type WorkerData = {
    fileName: string;
    config: ResolverConfig;
    isEntrypoint?: boolean;
  };

  export type WorkerResult = SourceFile;

  export type WorkerError = null;

  export type WorkerResponse = WorkerResult | WorkerError;
}
