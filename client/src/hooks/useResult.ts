import { useMemo } from "react";
import type { Result } from "../api";
import type { Nullable, Optional } from "@ubloimmo/front-util";

/**
 * A hook that handles a Result type by providing memoized data and error values
 * @template T The type of data contained in the Result
 * @param {Optional<Result<T>>} result The Result object containing data and/or error
 * @param {T} defaultValue Default value to use if result.data is undefined
 * @returns {[T, Nullable<string>]} A tuple containing the data value and error (if any)
 */
export const useResult = <T>(
  result: Optional<Result<T>>,
  defaultValue: T
): [T, Nullable<string>] => {
  const data = useMemo(() => {
    return result?.data ?? defaultValue;
  }, [result?.data, defaultValue]);

  const error = useMemo<Nullable<string>>(() => {
    return result?.error ?? null;
  }, [result?.error]);

  return [data, error];
};
