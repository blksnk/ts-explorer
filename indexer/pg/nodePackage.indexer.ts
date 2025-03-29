import { Logger, type Nullable } from "@ubloimmo/front-util";
import {
  db,
  schemas,
  type NodePackageInput,
  type NodePackageOutput,
} from "../../db";
import { eq } from "drizzle-orm";
import { batchOperation } from "../indexer.utils";
import type { NodePackage } from "../../parser";

const logger = Logger();

/**
 * Deletes a node package from the database by its ID
 * @param {number} nodePackageId - The ID of the node package to delete
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteNodePackage = async (nodePackageId: number) => {
  try {
    await db
      .delete(schemas.nodePackage)
      .where(eq(schemas.nodePackage.id, nodePackageId));
    logger.log(`Deleted node package ${nodePackageId}`, "deleteNodePackage");
    return true;
  } catch (e) {
    logger.error(e, "deleteNodePackage");
    return false;
  }
};

/**
 * Deletes all node packages from the database for a given project ID
 * @param {string} projectId - The ID of the project to delete node packages for
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const clearNodePackagesIn = async (
  projectId: string
): Promise<boolean> => {
  try {
    await db
      .delete(schemas.nodePackage)
      .where(eq(schemas.nodePackage.projectId, projectId));
    logger.log(
      `Deleted node packages for project ${projectId}`,
      "deleteNodePackagesIn"
    );
    return true;
  } catch (e) {
    logger.error(e, "deleteNodePackagesIn");
    return false;
  }
};

/**
 * Formats a node package object into a database input object
 *
 * @remarks Defined and used in case the NodePackage type is extended in the future
 *
 * @param {NodePackage} nodePackage - The node package to format
 * @param {string} nodePackage.name - The name of the node package
 * @param {string} nodePackage.version - The version of the node package
 * @returns {NodePackageInput} A node package input object ready for database insertion
 */
export const formatNodePackageInput = (
  { name, version }: NodePackage,
  projectId: string
): NodePackageInput => {
  return {
    name,
    version,
    projectId,
  };
};
/**
 * Indexes multiple node packages by inserting them into the database in batches
 * @param {NodePackageInput[]} nodePackageInputs - Array of node package inputs to index
 * @returns {Promise<Nullable<NodePackageOutput[]>>} Array of indexed node packages if successful, undefined if failed
 */
export const indexNodePackages = async (
  nodePackageInputs: NodePackageInput[]
): Promise<Nullable<NodePackageOutput[]>> => {
  try {
    const nodePackages = await batchOperation(
      nodePackageInputs,
      async (inputs) =>
        await db.insert(schemas.nodePackage).values(inputs).returning()
    );
    logger.log(
      `Indexed ${nodePackages.length} node packages`,
      "indexNodePackages"
    );
    return nodePackages;
  } catch (e) {
    logger.error(e, "indexNodePackages");
    return null;
  }
};
