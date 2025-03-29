import { eq } from "drizzle-orm";
import {
  db,
  schemas,
  type PackageImportInput,
  type PackageImportOutput,
} from "../../db";
import { Logger, type Nullable } from "@ubloimmo/front-util";
import { batchOperation } from "../indexer.utils";

const logger = Logger();

/**
 * Deletes all package imports associated with a file from the database
 * @param {number} fileId - The ID of the file whose package imports should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deletePackageImportIn = async (
  fileId: number
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.packageImport)
      .where(eq(schemas.packageImport.fileId, fileId));
    logger.log(
      `Deleted package imports for file ${fileId}`,
      "deletePackageImportIn"
    );
    return true;
  } catch (e) {
    logger.error(e, "deletePackageImportIn");
    return false;
  }
};

/**
 * Deletes all package imports associated with a node package from the database
 * @param {number} nodePackageId - The ID of the node package whose package imports should be deleted
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deletePackageImport = async (
  nodePackageId: number
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.packageImport)
      .where(eq(schemas.packageImport.nodePackageId, nodePackageId));
    logger.log(
      `Deleted package imports for node package ${nodePackageId}`,
      "deletePackageImport"
    );
    return true;
  } catch (e) {
    logger.error(e, "deletePackageImport");
    return false;
  }
};

/**
 * Formats a package import input object for database insertion
 * @param {number} fileId - The ID of the file that imports the package
 * @param {number} nodePackageId - The ID of the imported package node
 * @returns {PackageImportInput} A package import input object ready for database insertion
 */
export const formatPackageImportInput = (
  fileId: number,
  nodePackageId: number
): PackageImportInput => {
  return {
    fileId,
    nodePackageId,
  };
};

/**
 * Indexes multiple package imports by inserting them into the database in batches
 * @param {PackageImportInput[]} packageImportInputs - Array of package import inputs to index
 * @returns {Promise<Nullable<PackageImportOutput[]>>} Array of indexed package imports if successful, null if failed
 */
export const indexPackageImports = async (
  packageImportInputs: PackageImportInput[]
): Promise<Nullable<PackageImportOutput[]>> => {
  try {
    const packageImports = await batchOperation(
      packageImportInputs,
      async (inputs) =>
        await db.insert(schemas.packageImport).values(inputs).returning()
    );
    logger.log(
      `Indexed ${packageImports.length} package imports`,
      "indexPackageImports"
    );
    return packageImports;
  } catch (e) {
    logger.error(e, "indexPackageImports");
    return null;
  }
};
