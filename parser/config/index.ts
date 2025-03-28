import * as parserConfig from "./parser.config";
import * as tsConfig from "./ts.config";

export const Config = {
  ...parserConfig,
  ...tsConfig,
} as const;
