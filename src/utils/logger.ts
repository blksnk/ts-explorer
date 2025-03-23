import { Logger } from "@ubloimmo/front-util";
import jsonConfig from "../../tsexplorer.config.json";
import type { JsonConfig } from "../types";

const logConfig = (jsonConfig ?? {}) as JsonConfig;

export const logger = Logger({
  hideDebug: !logConfig.verbose,
  hideLogs: !logConfig.verbose,
});
