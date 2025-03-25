import { ApiClient } from "./api.client";
import {
  Project,
  ProjectDetails,
  type FileId,
  type FileRelationship,
  type ProjectId,
} from "./api.types";

/**
 * Creates project-related API endpoints
 * @param client - API client instance to use for requests
 * @returns Object containing project endpoint methods
 */
const projectEndpointsFactory = (client: ApiClient) => {
  /**
   * Gets list of all projects
   * @returns Promise resolving to array of projects
   */
  const list = async () => await client.get<Project[]>("/projects");

  /**
   * Gets a single project by ID
   * @param id - ID of project to get
   * @returns Promise resolving to project data
   */
  const get = async (id: ProjectId) =>
    await client.get<Project>(`/projects/${id}`);

  const details = async (id: ProjectId) =>
    await client.get<ProjectDetails>(`/projects/${id}/details`);

  /**
   * Gets list of files for a project
   * @param id - ID of project to get files for
   * @returns Promise resolving to array of files
   */
  const files = async (id: ProjectId) =>
    await client.get<File[]>(`/projects/${id}/files`);

  return {
    list,
    get,
    files,
    details,
  };
};

/**
 * Creates file-related API endpoints
 * @param client - API client instance to use for requests
 * @returns Object containing file endpoint methods
 */
const fileEndpointsFactory = (client: ApiClient) => {
  /**
   * Gets list of all files
   * @returns Promise resolving to array of files
   */
  const list = async () => await client.get<File[]>("/files");

  /**
   * Gets a single file by ID
   * @param id - ID of file to get
   * @returns Promise resolving to file data
   */
  const get = async (id: FileId) => await client.get<File>(`/files/${id}`);

  /**
   * Gets list of files that this file imports
   * @param id - ID of file to get imports for
   * @returns Promise resolving to array of file relationships
   */
  const imports = async (id: FileId) =>
    await client.get<FileRelationship[]>(`/files/${id}/imports`);

  /**
   * Gets list of files that import this file
   * @param id - ID of file to get imported-by relationships for
   * @returns Promise resolving to array of file relationships
   */
  const importedBy = async (id: FileId) =>
    await client.get<FileRelationship[]>(`/files/${id}/imported-by`);

  /**
   * Gets list of AST nodes for a file
   * @param id - ID of file to get nodes for
   * @returns Promise resolving to array of nodes
   */
  const nodes = async (id: FileId) =>
    await client.get<Node[]>(`/files/${id}/nodes`);

  return {
    list,
    get,
    imports,
    importedBy,
    nodes,
  };
};

/**
 * Creates an API endpoints object containing all endpoint methods
 * @param client - API client instance to use for requests
 * @returns Object containing project and file endpoint methods
 */
export const apiEndpointsFactory = (client: ApiClient) => {
  return {
    project: projectEndpointsFactory(client),
    file: fileEndpointsFactory(client),
  };
};

export type ApiEndpoints = ReturnType<typeof apiEndpointsFactory>;
