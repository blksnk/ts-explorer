import type { Nullable, DeepNonNullish } from "@ubloimmo/front-util";
import type * as ts from "typescript";

export type ResolverConfig = {
  resolveFileNodes?: boolean;
  resolveImportedModules?: boolean;
  skipNodeModules?: boolean;
};

type GithubAdapterConfig = {
  adapter: "github";
  token: string;
  repositorySlug: string;
  branch?: Nullable<string>;
};

type LocalAdapterConfig = {
  adapter: "local";
  projectRoot: Nullable<string>;
  entryPoints?: string[];
};

export type AdapterType = "github" | "local";

type AdapterConfig<TAdapter extends AdapterType> = TAdapter extends "github"
  ? GithubAdapterConfig
  : LocalAdapterConfig;

export type ProjectConfig<TAdapter extends AdapterType> = {
  projectName?: string;
  projectId?: Nullable<string>;
  adapter?: AdapterConfig<TAdapter>;
};

type ProgramConfig<TAdapter extends AdapterType> = ResolverConfig &
  ProjectConfig<TAdapter>;

type DebugConfig = {
  verbose?: boolean;
};

export type JsonConfig = ProgramConfig<AdapterType> & DebugConfig;

export type TsConfig = {
  tsConfigPath: Nullable<string>;
  tsConfig: Nullable<ts.ParsedCommandLine>;
};

export type DefaultConfig = Required<JsonConfig>;

export type StaticConfig<TAdapter extends AdapterType> = DeepNonNullish<
  ProgramConfig<TAdapter> & DebugConfig
>;

export type CompleteParserConfig<TAdapter extends AdapterType> =
  StaticConfig<TAdapter> & TsConfig;
