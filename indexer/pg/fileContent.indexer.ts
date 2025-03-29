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

/**
 * Deletes file contents from the database for a given file ID
 * @param {number} fileId - The ID of the file whose contents should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
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

/**
 * Formats a file content input object for database insertion
 * @param {number} fileId - The ID of the file to store content for
 * @param {string} content - The content of the file to store
 * @returns {FileContentInput} A file content input object ready for database insertion
 */
export const formatFileContentInput = (
  fileId: number,
  content: string
): FileContentInput => {
  return {
    content,
    fileId,
  };
};

/**
 * Indexes multiple file contents by inserting them into the database in batches
 * @param {FileContentInput[]} fileContentInputs - Array of file content inputs to index
 * @returns {Promise<Nullable<FileContentOutput[]>>} Array of indexed file contents if successful, null if failed
 */
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
