import "dotenv/config";
import { adapter } from "./adapter";

const main = async () => {
  await adapter.local();
};

main();
