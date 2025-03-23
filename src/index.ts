import "dotenv/config";
import { parse } from "./parser";
import { parseConfig } from "./config";

const main = async () => {
  const config = await parseConfig();
  await parse(config);
};

main();
