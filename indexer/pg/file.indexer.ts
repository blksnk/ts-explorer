import { eq } from "drizzle-orm";
import { db, schemas } from "../../db";
import { Logger } from "@ubloimmo/front-util";
import { deleteFileNodes } from "./node.indexer";
import { deleteFileImportBy, deleteFileImportOf } from "./fileImport.indexer";
import type { SourceFile, SourceFileInput } from "../../parser/types";
import type { FileInput, FileOutput } from "../../db";
import type { Nullable } from "@ubloimmo/front-util";
import { clearFileContentsIn, deleteFileContents } from "./fileContent.indexer";
import { batchOperation } from "../indexer.utils";
import { deletePackageImportIn } from "./packageImport.indexer";

const logger = Logger();

/**
 * Deletes a file record from the database by its ID
 * @param {number} fileId - The ID of the file to delete
 * @param {boolean} [deleteNodes = true] - Whether to delete the nodes associated with the file
 * @param {boolean} [deleteFileImports = true] - Whether to delete the file imports associated with the file
 * @param {boolean} [deleteFileContent = true] - Whether to delete the file content associated with the file
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFile = async (
  fileId: number,
  deleteNodes: boolean = true,
  deleteFileImports: boolean = true,
  deleteFileContent: boolean = true,
  deletePackageImports: boolean = true
): Promise<boolean> => {
  try {
    if (deleteNodes) {
      await deleteFileNodes(fileId);
      logger.log(`Deleted nodes for file ${fileId}`, "deleteFile");
    }
    if (deleteFileImports) {
      await Promise.all([
        deleteFileImportBy(fileId),
        deleteFileImportOf(fileId),
      ]);
      logger.log(`Deleted file imports for file ${fileId}`, "deleteFile");
    }
    if (deleteFileContent) {
      await deleteFileContents(fileId);
      logger.log(`Deleted file content for file ${fileId}`, "deleteFile");
    }
    if (deletePackageImports) {
      await deletePackageImportIn(fileId);
    }
    await db.delete(schemas.file).where(eq(schemas.file.id, fileId));
    logger.log(`Deleted file ${fileId}`, "deleteFile");
    return true;
  } catch (e) {
    logger.error(e, "deleteFile");
    return false;
  }
};

/**
 * Deletes all files in a project by their project ID, sequentially deleting nodes, file imports, file content and package imports
 * @param {string} projectId - The ID of the project to delete files from
 * @param {boolean} [deleteNodes = true] - Whether to delete the nodes associated with the files
 * @param {boolean} [deleteFileImports = true] - Whether to delete the file imports associated with the files
 * @param {boolean} [deleteFileContent = true] - Whether to delete the file content associated with the files
 * @param {boolean} [deletePackageImports = true] - Whether to delete the package imports associated with the files
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteFilesIn = async (
  projectId: string,
  deleteNodes: boolean = true,
  deleteFileImports: boolean = true,
  deleteFileContent: boolean = true,
  deletePackageImports: boolean = true
): Promise<boolean> => {
  try {
    const files = await db
      .select()
      .from(schemas.file)
      .where(eq(schemas.file.projectId, projectId));
    const results = await Promise.all(
      files.map((file) =>
        deleteFile(
          file.id,
          deleteNodes,
          deleteFileImports,
          deleteFileContent,
          deletePackageImports
        )
      )
    );
    const success = results.every((result) => result);
    if (success) {
      logger.log(`Deleted files for project ${projectId}`, "deleteFilesIn");
      return true;
    }
    logger.warn(
      "Failed to delete some or all files for project ${projectId}",
      "deleteFilesIn"
    );
    return false;
  } catch (e) {
    logger.error(e, "deleteFilesIn");
    return false;
  }
};

/**
 * Deletes all files in a project directly from the database without cascading deletes
 * @param {string} projectId - The ID of the project to delete files from
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const clearFilesIn = async (projectId: string): Promise<boolean> => {
  try {
    await db.delete(schemas.file).where(eq(schemas.file.projectId, projectId));
    logger.log(`Deleted files for project ${projectId}`, "clearFilesIn");
    return true;
  } catch (e) {
    logger.error(e, "clearFilesIn");
    return false;
  }
};

/**
 * Formats a source file into a database file input object
 * @param {SourceFileInput | SourceFile} sourceFile - The source file to format
 * @param {string} projectId - The ID of the project this file belongs to
 * @param {string} [projectRoot = ""] - The root directory of the project
 * @returns {FileInput} A database file input object containing the file's path, name, hash and project ID
 */
const formatFileInput = (
  sourceFile: SourceFileInput | SourceFile,
  projectId: string,
  projectRoot = ""
): FileInput => {
  const fileName = sourceFile.fileName;
  const name = fileName.split("/").pop() ?? fileName;
  let path =
    projectRoot.length && fileName.startsWith(projectRoot)
      ? fileName.slice(projectRoot.length)
      : fileName;
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  return {
    path,
    name,
    hash: sourceFile.hash,
    projectId,
    isEntrypoint: sourceFile.isEntrypoint ?? false,
  };
};

/**
 * Indexes a single source file into the database
 * @param {SourceFileInput | SourceFile} sourceFile - The source file to index
 * @param {string} projectId - The ID of the project this file belongs to
 * @param {string} [projectRoot = ""] - The root directory of the project
 * @returns {Promise<typeof schemas.file.$inferSelect | null>} The indexed file record if successful, null otherwise
 */
export const indexFile = async (
  sourceFile: SourceFileInput | SourceFile,
  projectId: string,
  projectRoot = ""
): Promise<Nullable<FileOutput>> => {
  try {
    const fileInput = formatFileInput(sourceFile, projectId, projectRoot);
    const files = await db.insert(schemas.file).values(fileInput).returning();
    const file = files[0];
    if (!file) {
      logger.warn(`Failed to index file ${fileInput.path}`, "indexFile");
      return null;
    }
    logger.log(`Indexed file ${fileInput.path}`, "indexFile");
    return file;
  } catch (e) {
    logger.error(e, "indexFile");
    return null;
  }
};

/**
 * Indexes multiple source files into the database
 * @param {(SourceFileInput | SourceFile)[]} sourceFiles - The array of source files to index
 * @param {string} projectId - The ID of the project these files belong to
 * @returns {Promise<typeof schemas.file.$inferSelect[] | null>} Array of indexed file records if successful, null otherwise
 */
export const indexFiles = async (
  sourceFiles: (SourceFileInput | SourceFile)[],
  projectId: string,
  projectRoot = ""
): Promise<Nullable<FileOutput[]>> => {
  try {
    if (!sourceFiles.length) return [];
    const fileInputs = sourceFiles.map((sourceFile) =>
      formatFileInput(sourceFile, projectId, projectRoot)
    );
    const files = await batchOperation(
      fileInputs,
      async (inputs) => await db.insert(schemas.file).values(inputs).returning()
    );
    logger.log(`Indexed ${files.length} files`, "indexFiles");
    return files;
  } catch (e) {
    logger.error(e, "indexFiles");
    return null;
  }
};
