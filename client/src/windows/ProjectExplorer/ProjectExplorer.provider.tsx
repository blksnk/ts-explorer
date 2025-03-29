import type { ReactNode } from "react";
import {
  PROJECT_EXPLORER_CONTEXT,
  useProjectExplorerStore,
} from "./ProjectExplorer.context.ts";
import type { Nullish } from "@ubloimmo/front-util";

/**
 * Provider component for the Project Explorer context
 * @param {Object} props Component props
 * @param {ReactNode} [props.children] Child components to render within the provider
 * @param {Nullish<string>} [props.projectId] ID of the project to load
 * @returns {ReactNode} Provider component
 */
export const ProjectExplorerProvider = ({
  children,
  projectId,
}: {
  children?: ReactNode;
  projectId?: Nullish<string>;
}): ReactNode => {
  const store = useProjectExplorerStore(projectId);
  return (
    <PROJECT_EXPLORER_CONTEXT.Provider value={store}>
      {children}
    </PROJECT_EXPLORER_CONTEXT.Provider>
  );
};
