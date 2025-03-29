import { eq } from "drizzle-orm";
import { db, schemas } from "../../db";
import type { AdapterType, CompleteParserConfig } from "../../parser/types";
import { Logger } from "@ubloimmo/front-util";
import { clearFilesIn, deleteFilesIn } from "./file.indexer";
import { clearNodePackagesIn } from "./nodePackage.indexer";
import { clearPackageImportsIn } from "./packageImport.indexer";
import { clearFileContentsIn } from "./fileContent.indexer";
import { clearFileNodesIn } from "./node.indexer";
import { clearFileImportsIn } from "./fileImport.indexer";

const logger = Logger();

/**
 * Clears all data associated with a project from the database without deleting the project record itself
 * @param {string} projectId - The ID of the project whose data should be cleared
 * @returns {Promise<boolean>} True if all data was cleared successfully, false if an error occurred
 */
export const clearProjectData = async (projectId: string): Promise<boolean> => {
  try {
    /// Delete all records that reference other records first
    // clear node packages & imports
    await clearPackageImportsIn(projectId);
    await clearNodePackagesIn(projectId);
    // clear file contents
    await clearFileContentsIn(projectId);
    // clear file nodes
    await clearFileNodesIn(projectId);
    // clear file imports
    await clearFileImportsIn(projectId);
    // clear files
    await clearFilesIn(projectId);
    return true;
  } catch (e) {
    logger.error(e, "deleteProjectData");
    return false;
  }
};

/**
 * Deletes a project from the database by its ID
 * @param {string} projectId - The ID of the project to delete
 * @param {boolean} [deleteProjectData = true] - Whether to delete the project data (files, nodes, imports, packages) along with the project
 * @returns {Promise<boolean>} True if deletion was successful, false if an error occurred
 */
export const deleteProject = async (
  projectId: string,
  deleteProjectData: boolean = true
): Promise<boolean> => {
  try {
    if (deleteProjectData) {
      await clearProjectData(projectId);
      logger.log(
        `Deleted project data for project ${projectId}`,
        "deleteProject"
      );
    }
    await db.delete(schemas.project).where(eq(schemas.project.id, projectId));
    logger.log(`Deleted project ${projectId}`, "deleteProject");
    return true;
  } catch (e) {
    logger.error(e, "deleteProject");
    return false;
  }
};

/**
 * Indexes a project by inserting or updating its record in the database
 * @param {CompleteParserConfig} config - Configuration object containing project details
 * @returns {Promise<Project[] | null>} Array containing the indexed project record, or null if operation fails
 */
export const indexProject = async (
  config: Pick<CompleteParserConfig<AdapterType>, "projectName" | "projectId">
) => {
  try {
    const projects = await db
      .insert(schemas.project)
      .values({
        name: config.projectName,
        id: config.projectId,
      })
      .onConflictDoUpdate({
        target: schemas.project.id,
        set: {
          name: config.projectName,
        },
      })
      .returning();
    const project = projects[0];
    if (!project) {
      logger.warn(
        `Failed to index project ${config.projectName} (${config.projectId})`,
        "indexProject"
      );
      return null;
    }
    logger.log(
      `Indexed project ${config.projectName} (${config.projectId})`,
      "indexProject"
    );
    return project;
  } catch (e) {
    logger.error(e, "indexProject");
    return null;
  }
};
