import type { ReactNode } from "react";
import type { Result } from "../../api";
import type { Nullish } from "@ubloimmo/front-util";

export type ResultWrapperProps<T> = {
  result: Nullish<Result<T>>;
  RenderData: (data: T) => ReactNode;
  RenderError?: (error: string) => ReactNode;
  RenderLoading?: () => ReactNode;
  loading?: boolean;
};
