import {
  isNull,
  isObject,
  type Nullable,
  type Predicate,
} from "@ubloimmo/front-util";
import type {
  FileHash,
  ResolverConfig,
  ProjectFile,
  SourceFile,
  TsConfig,
  NodePackageMap,
  ParseSourceFileImportsWorker,
} from "../types";
import { Logger } from "@ubloimmo/front-util";
import { cpus } from "node:os";
import { initWorker } from "../utils";
import { mapValues } from "../../indexer/indexer.utils";

const logger = Logger({
  hideDebug: true,
});

const MAX_WORKERS = Math.max(1, cpus().length - 1);

/**
 * Parses a source file and its imported modules into ProjectFile objects in parallel
 * @param {Nullable<SourceFile>} sourceFile - The source file to parse, or null
 * @param {Config} config - Configuration object containing parsing options
 * @returns {Promise<ProjectFile[]>} Array of ProjectFile objects containing the source file and its imports
 */
export const parseProjectFiles = async (
  sourceFiles: Nullable<Nullable<SourceFile>[]>,
  config: ResolverConfig & TsConfig,
  uniqueFileHashes: Set<FileHash>,
  uniquePackages: NodePackageMap
): Promise<ProjectFile[]> => {
  const rootFiles = (sourceFiles ?? []).filter(
    isObject as Predicate<SourceFile>
  );
  if (!rootFiles.length) {
    return [];
  }

  // add current files to collected hashes to avoid circular dependencies
  rootFiles.forEach((sourceFile) => {
    uniqueFileHashes.add(sourceFile.hash);
  });

  return new Promise(async (resolveProjectFiles) => {
    // init active & pending jobs
    const activeJobs = new Map<number, number>();
    // pendingJobs: jobId -> sourceFile
    const pendingJobs = new Map<number, SourceFile>(
      rootFiles.map((sourceFile, jobId) => [jobId, sourceFile])
    );
    // init collected project files
    const projectFilesMap = new Map<FileHash, ProjectFile>();
    // init next job id
    let nextJobId = pendingJobs.size + 1;

    const queuePromises: Promise<ProjectFile>[] = [];

    // init worker pool for parallel parsing
    const workerPool: {
      worker: Worker;
      workerId: number;
      jobId: Nullable<number>;
    }[] = [];

    for (let workerId = 0; workerId < MAX_WORKERS; workerId++) {
      const worker = initWorker(
        new URL("./workers/parseSourceFileImports.worker.ts", import.meta.url)
      );

      worker.onmessage = (
        event: MessageEvent<ParseSourceFileImportsWorker.WorkerResponse>
      ) => {
        const { jobId } = event.data;
        const endJob = () => {
          workerPool[workerId].jobId = null;
          activeJobs.delete(jobId);
          processQueue();
        };

        if (event.data.type === "error") {
          logger.error(event.data.error, `jobId: ${jobId}`);
          endJob();
          return;
        }
        uniqueFileHashes.add(event.data.sourceFile.hash);
        // store new parsed packages
        for (const newPackage of event.data.newPackages) {
          uniquePackages.set(newPackage.name, newPackage);
        }
        // store new parsed files and add them to the pending jobs
        for (const newFile of event.data.newFiles) {
          uniqueFileHashes.add(newFile.hash);
          pendingJobs.set(nextJobId++, newFile);
        }

        // store project file
        projectFilesMap.set(event.data.sourceFile.hash, {
          sourceFile: event.data.sourceFile,
          imports: event.data.fileImports,
          packageImports: event.data.packageImports,
        });
        endJob();
      };

      worker.onerror = (event: ErrorEvent) => {
        logger.error(event.error, `workerId: ${workerId}`);
        const self = workerPool.find(({ workerId: id }) => id === workerId);
        if (self) {
          self.jobId = null;
        }
        return;
      };

      workerPool.push({ worker, workerId, jobId: null });
    }

    const finishParsing = () => {
      logger.info(`Finished parsing ${projectFilesMap.size} files`);
      logger.log(`terminating ${workerPool.length} workers...`);
      workerPool.forEach(({ worker }) => worker.terminate());
      logger.log("workers terminated");
      resolveProjectFiles(mapValues(projectFilesMap));
    };

    const processQueue = () => {
      const idleWorkers = workerPool.filter(({ jobId }) => isNull(jobId));
      const jobsToProcess = pendingJobs.size;
      const workersToUse = Math.min(idleWorkers.length, jobsToProcess);

      const jobsToProcessArr = Array.from(pendingJobs.entries());

      logger.log(activeJobs.size, " active jobs");
      logger.log(pendingJobs.size, "pending jobs");

      if (!pendingJobs.size && !activeJobs.size) {
        finishParsing();
        return;
      }

      for (let workerIndex = 0; workerIndex < workersToUse; workerIndex++) {
        const { worker, workerId } = idleWorkers[workerIndex];
        const jobToProcess = jobsToProcessArr.shift();
        if (!jobToProcess) break;
        const [jobId, jobSourceFile] = jobToProcess;

        activeJobs.set(jobId, workerId);
        const jobData: ParseSourceFileImportsWorker.WorkerData = {
          jobId,
          sourceFile: jobSourceFile,
          uniqueFileHashes: Array.from(uniqueFileHashes),
          uniquePackageNames: Array.from(uniquePackages.keys()),
          config,
        };
        workerPool[workerId].jobId = jobId;
        logger.log(`Job ${jobId}: dispatched`, `worker ${workerId}`);
        worker.postMessage(jobData);
        pendingJobs.delete(jobId);
      }
    };

    processQueue();
  });
};
