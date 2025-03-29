import { Logger } from "@ubloimmo/front-util";
import { Parser, Config } from "../../parser";
import { index } from "../../indexer";

const logger = Logger();

const staticConfig = await Config.parseConfig<"local">();
const tsConfig = await Config.parseTsConfig(staticConfig);
const config = {
  ...staticConfig,
  ...tsConfig,
};
logger.debug(config, "config");

const parserMaps = await Parser.parseProject(config);
logger.info("done parsing");
// await index(config, parserMaps, "pg");
// logger.info("done indexing");
