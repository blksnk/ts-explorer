import type { Nullable, DeepNonNullish } from "@ubloimmo/front-util";
import type * as ts from "typescript";

export type JsonConfig = {
  entryPoint?: Nullable<string>;
  projectRoot?: Nullable<string>;
  resolveFileNodes?: boolean;
  resolveImportedModules?: boolean;
  skipNodeModules?: boolean;
};

export type ComputedConfig = {
  tsConfigPath: Nullable<string>;
  tsConfig: Nullable<ts.ParsedCommandLine>;
};

export type FullConfig = JsonConfig & ComputedConfig;

export type DefaultConfig = Required<JsonConfig>;

export type Config = DeepNonNullish<JsonConfig> & ComputedConfig;
