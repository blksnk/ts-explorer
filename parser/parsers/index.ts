import * as fileParser from "./file.parser";
import * as nodeParser from "./node.parser";
import * as projectParser from "./project.parser";

export const Parser = {
  ...fileParser,
  ...nodeParser,
  ...projectParser,
} as const;
