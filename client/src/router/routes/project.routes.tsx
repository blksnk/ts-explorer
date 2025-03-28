import type { RouteObject } from "react-router";
import {
  ProjectDetailsPage,
  ProjectFilesPage,
  ProjectListPage,
} from "../../pages";

export const projectRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProjectListPage />,
  },
  {
    path: "/projects/new",
    element: <>New project</>,
  },
  {
    path: "/projects/:id",
    element: <ProjectDetailsPage />,
  },
  {
    path: "/projects/:id/files",
    element: <ProjectFilesPage />,
  },
];
