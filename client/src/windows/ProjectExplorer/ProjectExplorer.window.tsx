import { WindowPane } from "../../components";
import { ProjectExplorerProvider } from "./ProjectExplorer.provider";
import { ProjectExplorerWindowHeader } from "./ProjectExplorer.header";
// import { ProjectExplorerWindowSideBar } from "./ProjectExplorer.sideBar";
import { ProjectExplorerProps } from "./ProjectExplorer.types";
import { ProjectExplorerContent } from "./ProjectExplorer.content";
import { useProjectDetailsContext } from "../../pages/ProjectDetails/ProjectDetails.context";

export const ProjectExplorerWindow = ({ projectId }: ProjectExplorerProps) => {
  const { setSelectedWindow, isWindowSelected } = useProjectDetailsContext();
  return (
    <ProjectExplorerProvider projectId={projectId}>
      <WindowPane
        identifier="project-explorer"
        active={isWindowSelected("project-explorer")}
        Header={ProjectExplorerWindowHeader}
        // SideBar={ProjectExplorerWindowSideBar}
        Content={ProjectExplorerContent}
        onSelect={setSelectedWindow}
      />
    </ProjectExplorerProvider>
  );
};
