import { eq } from "drizzle-orm";
import { db, schemas } from "../../db";
import type { AdapterType, CompleteParserConfig } from "../../parser/types";
import { Logger } from "@ubloimmo/front-util";
import { deleteFilesIn } from "./file.indexer";
import { deleteNodePackage, deleteNodePackagesIn } from "./nodePackage.indexer";

const logger = Logger();

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
      await deleteFilesIn(projectId, true, true, true, true);
      await deleteNodePackagesIn(projectId);
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
