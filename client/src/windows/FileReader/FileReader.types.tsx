import type { Nullish } from "@ubloimmo/front-util";
import type { FileId } from "../../api";

export type FileReaderProps = {
  fileId?: Nullish<FileId>;
  active?: boolean;
};
