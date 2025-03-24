import type {
  JsonConfig,
  DefaultConfig,
  StaticConfig,
  AdapterType,
} from "../types";
import jsonConfig from "../../tsexplorer.config.json";
import {
  isBoolean,
  isString,
  type DeepNonNullish,
  type Nullable,
} from "@ubloimmo/front-util";
export * from "./ts.config";

const defaultConfig: DefaultConfig = {
  adapter: {
    adapter: "local",
    entryPoint: null,
    projectRoot: null,
  },
  resolveFileNodes: true,
  resolveImportedModules: true,
  skipNodeModules: true,
  verbose: false,
  projectName: "Untitled Project",
  projectId: null,
};

const validateLocalAdapter = (
  adapter: DefaultConfig["adapter"]
): adapter is DeepNonNullish<DefaultConfig["adapter"]> => {
  if (adapter.adapter !== "local") {
    return false;
  }
  if (!isString(adapter.projectRoot)) {
    return false;
  }
  if (!isString(adapter.entryPoint)) {
    return false;
  }
  return true;
};

const validateGithubAdapter = (
  adapter: DefaultConfig["adapter"]
): adapter is DeepNonNullish<DefaultConfig["adapter"]> => {
  if (adapter.adapter !== "github") {
    return false;
  }
  if (!isString(adapter.token)) {
    return false;
  }
  if (!isString(adapter.repositorySlug)) {
    return false;
  }
  return true;
};

/**
 * Validates the configuration object and ensures required fields are present and of correct type
 * @param {DefaultConfig} config - The configuration object to validate
 * @returns {DeepNonNullish<DefaultConfig>} The validated configuration with all fields non-null
 * @throws {Error} If projectRoot or entryPoint are not valid strings
 */
const validateConfig = ({
  adapter,
  resolveFileNodes,
  resolveImportedModules,
  skipNodeModules,
  verbose,
  projectName,
  projectId,
}: DefaultConfig): DeepNonNullish<DefaultConfig> => {
  if (!isString(adapter.adapter)) {
    throw new Error("adapter.adapter must be a string");
  }
  switch (adapter.adapter) {
    case "local":
      if (!validateLocalAdapter(adapter)) {
        throw new Error("Invalid local adapter");
      }
      break;
    case "github":
      if (!validateGithubAdapter(adapter)) {
        throw new Error("Invalid github adapter");
      }
      break;
    default:
      throw new Error("Invalid adapter");
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
  if (!isBoolean(verbose)) {
    throw new Error("verbose must be a boolean");
  }
  if (!isString(projectName)) {
    throw new Error("projectName must be a string");
  }
  if (!isString(projectId)) {
    throw new Error("projectId must be a string");
  }
  return {
    adapter,
    resolveFileNodes,
    resolveImportedModules,
    skipNodeModules,
    verbose,
    projectName,
    projectId,
  };
};

/**
 * Parses and validates the configuration from the JSON config file
 * Merges it with default config and finds the tsconfig.json path
 * @returns {Config} The complete validated configuration object
 */
export const parseConfig = async <TAdapter extends AdapterType>(
  overrideConfig: Partial<JsonConfig> = {}
): Promise<StaticConfig<TAdapter>> => {
  const config = validateConfig({
    ...defaultConfig,
    ...((jsonConfig ?? {}) as JsonConfig),
    ...overrideConfig,
  });

  return config as StaticConfig<TAdapter>;
};
