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
