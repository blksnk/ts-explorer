import { useParams } from "react-router";
import { ProjectExplorerWindow } from "../../windows/ProjectExplorer/ProjectExplorer.window";
import { FileReaderWindow } from "../../windows/FileReader/FileReader.window";
import { GridLayout, GridTemplate, useStatic } from "@ubloimmo/uikit";
import styled from "styled-components";
import { ProjectDetailsProvider } from "./ProjectDetails.provider";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const columns = useStatic<GridTemplate>(["2fr", "1fr"]);

  return (
    <ProjectDetailsProvider>
      <WindowContainer fill gap="s-2" columns={columns}>
        <ProjectExplorerWindow projectId={id} />
        <FileReaderWindow />
      </WindowContainer>
    </ProjectDetailsProvider>
  );
};

const WindowContainer = styled(GridLayout)`
  flex: 1;
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
`;
