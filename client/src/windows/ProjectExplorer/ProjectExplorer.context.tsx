import { isObject, type Nullish } from "@ubloimmo/front-util";
import { useApi } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo, type ReactNode } from "react";

const useProjectExplorerStore = (id: Nullish<string>) => {
  const api = useApi();
  const projectData = useQuery({
    queryKey: api.queryKeys.project.get(id),
    queryFn: () => api.endpoints.project.get(id ?? ""),
  });

  const projectDetails = useQuery({
    queryKey: api.queryKeys.project.details(id),
    queryFn: () => api.endpoints.project.details(id ?? ""),
  });

  const loading = useMemo(
    () => projectData.isLoading || projectDetails.isLoading,
    [projectData.isLoading, projectDetails.isLoading]
  );

  const details = useMemo(() => {
    if (
      !isObject(projectDetails.data?.data) ||
      !isObject(projectData.data?.data)
    )
      return null;
    return {
      ...projectDetails.data.data,
      ...projectData.data.data,
    };
  }, [projectDetails.data, projectData.data]);

  return {
    details,
    loading,
    id,
  };
};

export type ProjectExplorerContext = ReturnType<typeof useProjectExplorerStore>;

const ProjectExplorerContext = createContext<ProjectExplorerContext>({
  details: null,
  loading: true,
  id: null,
});

export const ProjectExplorerProvider = ({
  children,
  projectId,
}: {
  children?: ReactNode;
  projectId?: Nullish<string>;
}) => {
  const store = useProjectExplorerStore(projectId);
  return (
    <ProjectExplorerContext.Provider value={store}>
      {children}
    </ProjectExplorerContext.Provider>
  );
};

export const useProjectExplorerContext = () =>
  useContext(ProjectExplorerContext);
