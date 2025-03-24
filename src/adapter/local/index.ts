import { parseConfig, parseTsConfig } from "../../config";
import { index } from "../../indexer";
import { parse } from "../../parser";

/**
 * Local adapter that handles parsing and indexing of a local TypeScript project
 * Parses configuration, TypeScript config, and project files before indexing them
 * @returns {Promise<void>} A promise that resolves when parsing and indexing is complete
 */
export const localAdapter = async (): Promise<void> => {
  const staticConfig = await parseConfig<"local">();
  const tsConfig = await parseTsConfig(staticConfig);
  const config = {
    ...staticConfig,
    ...tsConfig,
  };
  const parserMaps = await parse(config);
  await index(config, parserMaps, "pg");
};
