import { useParams } from "react-router";
import { PageLayout } from "../../layouts";
import { ProjectExplorerWindow } from "../../windows/ProjectExplorer/ProjectExplorer.window";
import { FileReaderWindow } from "../../windows/FileReader/FileReader.window";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout>
      <ProjectExplorerWindow projectId={id} />
      <FileReaderWindow fileId={38979} />
    </PageLayout>
  );
};
