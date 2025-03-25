import type { RouteObject } from "react-router";
import { ProjectListPage } from "../../pages";

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
    element: <>Project details</>,
    children: [
      {
        path: "/projects/:id/files",
        element: <>project files</>,
      },
    ],
  },
];
