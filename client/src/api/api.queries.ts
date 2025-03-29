import type { Nullish } from "@ubloimmo/front-util";
import type { ApiEndpoints } from "./api.endpoints";

type DeepReplace<T, R> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: DeepReplace<T[K], R>;
    }
  : R;

export type ApiQueryKeyFn = (
  ...args: Nullish<string | number>[]
) => (string | number)[];

export type ApiQueryKeys = DeepReplace<ApiEndpoints, ApiQueryKeyFn>;

export const API_QUERY_KEYS: ApiQueryKeys = {
  project: {
    list: () => ["projects"],
    get: (id) => ["projects", id ?? ""],
    files: (id) => ["projects", id ?? "", "files"],
    details: (id) => ["projects", id ?? "", "details"],
    nodePackages: (id) => ["projects", id ?? "", "node-packages"],
  },
  file: {
    list: () => ["files"],
    get: (id) => ["files", id ?? ""],
    imports: (id) => ["files", id ?? "", "imports"],
    importedBy: (id) => ["files", id ?? "", "imported-by"],
    nodes: (id) => ["files", id ?? "", "nodes"],
    importedPackages: (id) => ["files", id ?? "", "imported-packages"],
    content: (id) => ["files", id ?? "", "content"],
  },
};
