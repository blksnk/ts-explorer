import { MAX_BATCH_SIZE } from "./indexer.constants";

/**
 * Converts a Map's values into an array
 * @template K - The type of keys in the Map
 * @template V - The type of values in the Map
 * @param {Map<K, V>} map - The Map to extract values from
 * @returns {V[]} An array containing all values from the Map
 */
export const mapValues = <K, V>(map: Map<K, V>): V[] => {
  return Array.from(map.values());
};

/**
 * Executes an operation on batches of data with a specified batch size
 * @template TData - The type of data elements to process
 * @template TResult - The type of result elements returned by the operation
 * @param {TData[]} data - Array of data elements to process in batches
 * @param {function(TData[]): Promise<TResult[]>} operation - Async function that processes a batch of data and returns results
 * @param {number} [batchSize=MAX_BATCH_SIZE] - Maximum size of each batch
 * @returns {Promise<TResult[]>} Array containing all results from processing the batches
 */
export const batchOperation = async <TData, TResult>(
  data: TData[],
  operation: (data: TData[]) => Promise<TResult[]>,
  batchSize: number = MAX_BATCH_SIZE
): Promise<TResult[]> => {
  // if there is no data, return an empty array
  if (!data.length) return [];
  // if the data is less than or equal to the batch size, process the data in one go
  if (data.length <= batchSize) return await operation(data);
  // if the data is greater than the batch size, split it into batches
  const batches = [];
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    batches.push(batch);
  }
  // process each batch in parallel
  const results = await Promise.all(
    batches.map(async (batch) => await operation(batch))
  );
  // flatten the results
  return results.flat();
};
