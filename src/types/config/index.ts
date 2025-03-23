import type { Nullable, DeepNonNullish } from "@ubloimmo/front-util";
import type * as ts from "typescript";

type ParserConfig = {
  resolveFileNodes?: boolean;
  resolveImportedModules?: boolean;
  skipNodeModules?: boolean;
};

type ProjectConfig = {
  entryPoint?: Nullable<string>;
  projectRoot?: Nullable<string>;
};

type ProgramConfig = ParserConfig & ProjectConfig;

type DebugConfig = {
  verbose?: boolean;
};

export type JsonConfig = ProgramConfig & DebugConfig;

export type ComputedConfig = {
  tsConfigPath: Nullable<string>;
  tsConfig: Nullable<ts.ParsedCommandLine>;
};

export type DefaultConfig = Required<JsonConfig>;

export type Config = DeepNonNullish<JsonConfig> & ComputedConfig;
