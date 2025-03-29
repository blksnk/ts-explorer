import { eq } from "drizzle-orm";
import type { Nullable } from "@ubloimmo/front-util";
import {
  type FileImportInput,
  type FileImportOutput,
  db,
  schemas,
} from "../../db";
import { Logger } from "@ubloimmo/front-util";

const logger = Logger();

/**
 * Deletes all file import records from the database for a given importing file ID
 * @param {number} importingFileId - The ID of the importing file whose imports should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFileImportBy = async (
  importingFileId: number
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.fileImport)
      .where(eq(schemas.fileImport.importingFileId, importingFileId));
    logger.log(
      `Deleted file imports imported by file ${importingFileId}`,
      "deleteFileImportBy"
    );
    return true;
  } catch (e) {
    logger.error(e, "deleteFileImportBy");
    return false;
  }
};

/**
 * Deletes all file import records from the database for a given imported file ID
 * @param {number} importedFileId - The ID of the imported file whose imports should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFileImportOf = async (
  importedFileId: number
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.fileImport)
      .where(eq(schemas.fileImport.importedFileId, importedFileId));
    logger.log(
      `Deleted file imports of file ${importedFileId}`,
      "deleteFileImportOf"
    );
    return true;
  } catch (e) {
    logger.error(e, "deleteFileImportOf");
    return false;
  }
};

/**
 * Deletes a file import record from the database by its ID
 * @param {number} fileImportId - The ID of the file import to delete
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFileImport = async (
  fileImportId: number
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.fileImport)
      .where(eq(schemas.fileImport.id, fileImportId));
    logger.log(`Deleted file import ${fileImportId}`, "deleteFileImport");
    return true;
  } catch (e) {
    logger.error(e, "deleteFileImport");
    return false;
  }
};

/**
 * Deletes all file import records from the database for a given project ID
 * @param {string} projectId - The ID of the project whose file imports should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const clearFileImportsIn = async (
  projectId: string
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.fileImport)
      .where(eq(schemas.fileImport.projectId, projectId));
    logger.log(
      `Deleted file imports for project ${projectId}`,
      "clearFileImportsIn"
    );
    return true;
  } catch (e) {
    logger.error(e, "clearFileImportsIn");
    return false;
  }
};

/**
 * Indexes a file import record into the database
 * @param {number} importingFileId - The ID of the importing file
 * @param {number} importedFileId - The ID of the imported file
 * @param {string} projectId - The ID of the project this file import belongs to
 * @returns {Promise<Nullable<FileImportInput>>} The indexed file import record if successful, null if an error occurred
 */
export const indexFileImport = async (
  importingFileId: number,
  importedFileId: number,
  projectId: string
): Promise<Nullable<FileImportOutput>> => {
  try {
    const fileImports = await db
      .insert(schemas.fileImport)
      .values({ importingFileId, importedFileId, projectId })
      .returning();
    const fileImport = fileImports[0];
    if (!fileImport) {
      logger.warn(
        `Failed to index file import ${importingFileId} -> ${importedFileId}`,
        "indexFileImport"
      );
      return null;
    }
    logger.log(
      `Indexed file import ${importingFileId} -> ${importedFileId}`,
      "indexFileImport"
    );
    return fileImport;
  } catch (e) {
    logger.error(e, "indexFileImport");
    return null;
  }
};

/**
 * Indexes multiple file import records into the database
 * @param {FileImportInput[]} fileImportInputs - The file import records to index
 * @returns {Promise<Nullable<FileImportOutput[]>>} The indexed file import records if successful, null if an error occurred
 */
export const indexFileImports = async (
  fileImportInputs: FileImportInput[]
): Promise<Nullable<FileImportOutput[]>> => {
  try {
    if (!fileImportInputs.length) return [];
    const fileImports = await db
      .insert(schemas.fileImport)
      .values(fileImportInputs)
      .returning();
    logger.log(
      `Indexed ${fileImports.length} file imports`,
      "indexFileImports"
    );
    return fileImports;
  } catch (e) {
    logger.error(e, "indexFileImports");
    return null;
  }
};
