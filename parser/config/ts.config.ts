import * as ts from "typescript";
import { isString, Logger, type Nullable } from "@ubloimmo/front-util";
import * as bun from "bun";
import type { AdapterType, StaticConfig, TsConfig } from "../types";

const logger = Logger();

/**
 * Parses and validates the TypeScript configuration file
 * @param {Nullable<string>} tsConfigPath - Path to the tsconfig.json file
 * @param {Nullable<string>} projectRoot - Root directory of the project
 * @returns {Promise<Nullable<ts.ParsedCommandLine>>} Parsed TypeScript configuration object or null if invalid
 */
export const findTsConfigJson = async (
  tsConfigPath: Nullable<string>,
  projectRoot: Nullable<string>
): Promise<Nullable<ts.ParsedCommandLine>> => {
  if (!isString(tsConfigPath)) {
    logger.warn("No tsconfig.json path provided, aborting", "parseTsConfig");
    return null;
  }
  if (!isString(projectRoot)) {
    logger.warn("No project root provided, aborting", "parseTsConfig");
    return null;
  }
  if (!bun.file(tsConfigPath).exists()) {
    logger.warn(
      `tsconfig.json file does not exist at ${tsConfigPath}, aborting`,
      "parseTsConfig"
    );
    return null;
  }
  try {
    const tsConfigFileContent = await bun.file(tsConfigPath).text();
    const tsConfigObject = ts.parseConfigFileTextToJson(
      tsConfigPath,
      tsConfigFileContent
    );
    const tsConfig = ts.parseJsonConfigFileContent(
      tsConfigObject.config,
      ts.sys,
      projectRoot
    );
    return tsConfig;
  } catch (error) {
    logger.error(error, "parseTsConfig");
    return null;
  }
};

/**
 * Parses and validates the TypeScript configuration based on the adapter type
 * @param {StaticConfig<AdapterType>} param0 - Configuration object containing adapter settings
 * @param {Nullable<string>} [overrideProjectRoot] - Optional override for the project root path
 * @returns {Promise<TsConfig>} Object containing tsconfig path and parsed configuration
 */
export const parseTsConfig = async (
  { adapter }: StaticConfig<AdapterType>,
  overrideProjectRoot?: Nullable<string>
): Promise<TsConfig> => {
  const projectRoot =
    overrideProjectRoot ??
    (adapter.adapter === "local"
      ? adapter.projectRoot
      : `./tmp/${adapter.repositorySlug}`);
  const tsConfigPath =
    ts.findConfigFile(projectRoot, ts.sys.fileExists, "tsconfig.json") ?? null;
  logger.debug(tsConfigPath, "tsConfigPath");
  const tsConfig = await findTsConfigJson(tsConfigPath, projectRoot);

  logger.debug(tsConfig, "tsConfig");

  return {
    tsConfigPath,
    tsConfig,
  };
};
