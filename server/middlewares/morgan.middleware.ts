import morganBase, { type FormatFn } from "morgan";
import chalk from "chalk";
import { isNumber, isString, type Optional } from "@ubloimmo/front-util";

const statusColor = (status: Optional<number>) => {
  if (!isNumber(status)) return chalk.blackBright.bgGray(status);
  const paddedStr = ` ${status} `;
  if (isNaN(status)) return chalk.blackBright.bgGray(paddedStr);

  if (status >= 500) return chalk.blackBright.bgRedBright(paddedStr);
  if (status >= 400) return chalk.blackBright.bgYellowBright(paddedStr);
  if (status >= 300) return chalk.blackBright.bgGreenBright(paddedStr);
  return chalk.blackBright.bgCyanBright(paddedStr);
};

const methodColor = (method: Optional<string>) => {
  if (!isString(method)) return chalk.black.bgGray(method);
  const paddedStr = ` ${method} `;
  if (method === "GET") return chalk.black.bgWhite(paddedStr);
  if (method === "POST") return chalk.black.bgBlue(paddedStr);
  if (method === "PUT") return chalk.black.bgYellow(paddedStr);
  if (method === "DELETE") return chalk.black.bgRed(paddedStr);
  return chalk.black.bgGray(paddedStr);
};

const responseTimeColor = (responseTime: Optional<string>) => {
  if (!isString(responseTime)) return chalk.black.bgGray(responseTime);
  const responseTimeNum = parseFloat(responseTime);
  if (isNaN(responseTimeNum)) return chalk.black.bgGray(responseTime);
  const formattedResponseTime = ` ${responseTimeNum}ms `;
  if (responseTimeNum < 50) return chalk.black.bgGreen(formattedResponseTime);
  if (responseTimeNum < 100)
    return chalk.black.bgGreenBright(formattedResponseTime);
  if (responseTimeNum < 200) return chalk.black.bgYellow(formattedResponseTime);
  if (responseTimeNum < 300)
    return chalk.black.bgYellowBright(formattedResponseTime);
  if (responseTimeNum < 400) return chalk.black.bgRed(formattedResponseTime);
  return chalk.black.bgRedBright(formattedResponseTime);
};

const formatFn: FormatFn = (tokens, req, res) => {
  return [
    methodColor(tokens.method(req, res)),
    chalk.bgGray(" "),
    statusColor(res.statusCode),
    chalk.bgGray(" "),
    chalk.bgGray.white(tokens.url(req, res)),
    chalk.bgGray(" "),
    responseTimeColor(tokens["response-time"](req, res)),
    "\n",
  ].join("");
};

export const morgan = morganBase(formatFn);
