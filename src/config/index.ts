import type { JsonConfig, DefaultConfig, Config } from "../types";
import jsonConfig from "../../tsexplorer.config.json";
import * as ts from "typescript";
import {
  isBoolean,
  isString,
  type DeepNonNullish,
  type Nullable,
} from "@ubloimmo/front-util";
import { logger } from "../utils";
import * as bun from "bun";

const defaultConfig: DefaultConfig = {
  entryPoint: null,
  projectRoot: null,
  resolveFileNodes: true,
  resolveImportedModules: true,
  skipNodeModules: true,
};

/**
 * Validates the configuration object and ensures required fields are present and of correct type
 * @param {DefaultConfig} config - The configuration object to validate
 * @returns {DeepNonNullish<DefaultConfig>} The validated configuration with all fields non-null
 * @throws {Error} If projectRoot or entryPoint are not valid strings
 */
const validateConfig = ({
  entryPoint,
  projectRoot,
  resolveFileNodes,
  resolveImportedModules,
  skipNodeModules,
}: DefaultConfig): DeepNonNullish<DefaultConfig> => {
  if (!isString(projectRoot)) {
    throw new Error("projectRoot is required");
  }
  if (!isString(entryPoint)) {
    throw new Error("entryPoint is required");
  }
  if (!isBoolean(resolveFileNodes)) {
    throw new Error("resolveFileNodes must be a boolean");
  }
  if (!isBoolean(resolveImportedModules)) {
    throw new Error("resolveImportedModules must be a boolean");
  }
  if (!isBoolean(skipNodeModules)) {
    throw new Error("skipNodeModules must be a boolean");
  }
  return {
    entryPoint,
    projectRoot,
    resolveFileNodes,
    resolveImportedModules,
    skipNodeModules,
  };
};

/**
 * Parses and validates the TypeScript configuration file
 * @param {Nullable<string>} tsConfigPath - Path to the tsconfig.json file
 * @param {Nullable<string>} projectRoot - Root directory of the project
 * @returns {Promise<Nullable<ts.ParsedCommandLine>>} Parsed TypeScript configuration object or null if invalid
 */
const parseTsConfig = async (
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
    const tsConfigObject = ts.parseJsonConfigFileContent(
      tsConfigFileContent,
      ts.sys,
      projectRoot
    );
    return tsConfigObject;
  } catch (error) {
    logger.error(error, "parseTsConfig");
    return null;
  }
};

/**
 * Parses and validates the configuration from the JSON config file
 * Merges it with default config and finds the tsconfig.json path
 * @returns {Config} The complete validated configuration object
 */
export const parseConfig = async (): Promise<Config> => {
  const config = validateConfig({
    ...defaultConfig,
    ...((jsonConfig ?? {}) as JsonConfig),
  });

  const tsConfigPath =
    ts.findConfigFile(config.projectRoot, ts.sys.fileExists, "tsconfig.json") ??
    null;
  const tsConfig = await parseTsConfig(tsConfigPath, config.projectRoot);

  return { ...config, tsConfigPath, tsConfig };
};
