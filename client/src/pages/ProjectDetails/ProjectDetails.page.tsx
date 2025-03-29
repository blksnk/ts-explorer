import { useParams } from "react-router";
import { PageLayout } from "../../layouts";
import { ProjectExplorerWindow } from "../../windows/ProjectExplorer/ProjectExplorer.window";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout>
      <ProjectExplorerWindow projectId={id} />
    </PageLayout>
  );
};
