import type { AdapterType, Config, ParserMaps, StaticConfig } from "../types";
import { logger } from "../utils";
import * as pg from "./pg";

type Indexer = "pg" | "graph";

export const index = async (
  config: StaticConfig<AdapterType>,
  parserMaps: ParserMaps,
  indexer: Indexer = "pg"
) => {
  switch (indexer) {
    case "pg":
      return await pg.index(config, parserMaps);
    case "graph":
      logger.warn("Graph indexing is not yet implemented", "index");
      return;
    default:
      logger.error("Invalid indexer", "index");
      return;
  }
};
