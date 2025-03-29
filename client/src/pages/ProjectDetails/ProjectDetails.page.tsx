import { useParams } from "react-router";
import { ProjectExplorerWindow } from "../../windows/ProjectExplorer/ProjectExplorer.window";
import { FileReaderWindow } from "../../windows/FileReader/FileReader.window";
import { GridLayout } from "@ubloimmo/uikit";
import styled from "styled-components";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <WindowContainer fill gap="s-2" columns={2}>
      <ProjectExplorerWindow projectId={id} />
      <FileReaderWindow fileId={2579} active />
    </WindowContainer>
  );
};

const WindowContainer = styled(GridLayout)`
  flex: 1;
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
`;
