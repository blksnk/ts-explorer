import { isNullish } from "@ubloimmo/front-util";
import type { ResultWrapperProps } from "./ResultWrapper.types";
import { Callout, SmallLoader } from "@ubloimmo/uikit";
import type { ReactNode } from "react";

/**
 * A wrapper component that handles different states of a Result type
 * @template T The type of data contained in the Result
 * @param {ResultWrapperProps<T>} props Component props
 * @returns {ReactNode} The rendered component based on the result state
 */
export const ResultWrapper = <T,>({
  result,
  loading,
  errorTitle,
  RenderData,
  RenderError,
  RenderLoading,
}: ResultWrapperProps<T>): ReactNode => {
  if (isNullish(result) || loading) {
    if (RenderLoading) return <RenderLoading />;
    return <SmallLoader />;
  }

  if (result.error) {
    if (RenderError) return RenderError(result.error);
    return (
      <Callout color="error" title={errorTitle ?? "Error"}>
        {result.error}
      </Callout>
    );
  }

  return RenderData(result.data);
};
