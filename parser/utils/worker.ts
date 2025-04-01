/**
 * Creates a Promise that wraps a Worker thread execution
 * @template TData The type of data returned from the worker
 * @template TArg The type of data passed to the worker
 * @param {Worker} worker - The worker to execute
 * @param {TArg} initialData - Initial data to pass to the worker
 * @param {boolean} [singleUse=false] - Whether to terminate the worker after completion
 * @returns {Promise<TData>} Promise that resolves with the worker's result
 */
export const workerPromise = <TData, TArg>(
  worker: Worker,
  initialData: TArg,
  singleUse: boolean = false
): Promise<TData> => {
  return new Promise<TData>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<TData>) => {
      if (singleUse) worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (error) => {
      reject(error);
    };
    worker.onmessageerror = (error) => {
      reject(error);
    };
    worker.postMessage(initialData);
  });
};

/**
 * Creates and initializes a new Worker instance
 * @param {URL} workerUrl - The URL of the worker script to load
 * @returns {Worker} The initialized Worker instance
 */
export const initWorker = (workerUrl: URL) => {
  const worker = new Worker(workerUrl);
  return worker;
};
