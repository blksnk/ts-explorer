import { Logger } from "@ubloimmo/front-util";
import { Config } from "../parser";
import { clearProjectData } from "../indexer/pg/project.indexer";

const logger = Logger();

const staticConfig = await Config.parseConfig<"local">();
const tsConfig = await Config.parseTsConfig(staticConfig);
const config = {
  ...staticConfig,
  ...tsConfig,
};
logger.debug(config, "config");
await clearProjectData(config.projectId);
logger.info(
  `Cleared project data for ${config.projectName} (${config.projectId})`
);
