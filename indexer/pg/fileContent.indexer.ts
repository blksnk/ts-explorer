import { Logger, type Nullable } from "@ubloimmo/front-util";
import {
  db,
  schemas,
  type FileContentInput,
  type FileContentOutput,
} from "../../db";
import { eq } from "drizzle-orm";
import { batchOperation } from "../indexer.utils";

const logger = Logger();

export const deleteFileContents = async (fileId: number): Promise<boolean> => {
  try {
    await db
      .delete(schemas.fileContent)
      .where(eq(schemas.fileContent.fileId, fileId));
    logger.log(
      `Deleted file contents for file ${fileId}`,
      "deleteFileContents"
    );
    return true;
  } catch (e) {
    logger.error(e, "deleteFileContents");
    return false;
  }
};

export const formatFileContentInput = (
  fileId: number,
  content: string
): FileContentInput => {
  return {
    content,
    fileId,
  };
};

export const indexFileContents = async (
  fileContentInputs: FileContentInput[]
): Promise<Nullable<FileContentOutput[]>> => {
  try {
    const fileContents = await batchOperation(
      fileContentInputs,
      async (inputs) => {
        const contents = await db
          .insert(schemas.fileContent)
          .values(inputs)
          .returning();
        logger.log(
          `Indexed ${contents.length} file contents`,
          "indexFileContents"
        );
        return contents;
      }
    );
    logger.log(
      `Indexed total of ${fileContents.length} file contents`,
      "indexFileContents"
    );
    return fileContents;
  } catch (e) {
    logger.error(e, "indexFileContents");
    return null;
  }
};
