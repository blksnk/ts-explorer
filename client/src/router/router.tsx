import { createBrowserRouter, Outlet } from "react-router";
import { projectRoutes } from "./routes";
import { RootLayout } from "../layouts";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    children: [...projectRoutes],
  },
]);

export { router };
