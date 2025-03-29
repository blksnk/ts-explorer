import { WindowPane } from "../../components";
import { ProjectExplorerProvider } from "./ProjectExplorer.provider";
import { ProjectExplorerWindowHeader } from "./ProjectExplorer.header";
import { ProjectExplorerWindowSideBar } from "./ProjectExplorer.sideBar";
import { ProjectExplorerProps } from "./ProjectExplorer.types";

export const ProjectExplorerWindow = ({
  projectId,
  active,
}: ProjectExplorerProps) => {
  return (
    <ProjectExplorerProvider projectId={projectId}>
      <WindowPane
        active={active}
        Header={ProjectExplorerWindowHeader}
        SideBar={ProjectExplorerWindowSideBar}
      />
    </ProjectExplorerProvider>
  );
};
