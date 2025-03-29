import { Logger } from "@ubloimmo/front-util";
import { Config } from "../parser";
import { deleteProject } from "../indexer/pg/project.indexer";

const logger = Logger();

const staticConfig = await Config.parseConfig<"local">();
const tsConfig = await Config.parseTsConfig(staticConfig);
const config = {
  ...staticConfig,
  ...tsConfig,
};
logger.debug(config, "config");
await deleteProject(config.projectId);
logger.info(`Deleted project ${config.projectName} (${config.projectId})`);
