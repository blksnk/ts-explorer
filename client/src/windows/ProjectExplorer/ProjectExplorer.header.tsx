import { useMemo } from "react";
import {
  Breadcrumb,
  Breadcrumbs,
  WindowHeader,
  type WindowSlot,
} from "../../components";
import { useProjectExplorerContext } from "./ProjectExplorer.context.ts";

export const ProjectExplorerWindowHeader: WindowSlot = ({ active }) => {
  const { details } = useProjectExplorerContext();

  const crumbs = useMemo<Breadcrumb[]>(() => {
    if (!details) return [];
    return [
      {
        label: "Projects",
        path: "/",
      },
      {
        label: details.name,
        path: `/projects/${details.id}`,
      },
    ];
  }, [details]);

  return (
    <WindowHeader
      active={active}
      icon="FolderSparkle"
      title={<Breadcrumbs crumbs={crumbs} />}
    />
  );
};
