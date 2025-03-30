import type { Nullable } from "@ubloimmo/front-util";
import { createContext, useCallback, useContext, useState } from "react";

export type ProjectDetailsWindowIdentifier = "project-explorer" | "file-reader";

export const useProjectDetailsStore = () => {
  const [selectedFile, setSelectedFile] = useState<Nullable<number>>(null);
  const [selectedWindow, setSelectedWindow] =
    useState<ProjectDetailsWindowIdentifier>("project-explorer");

  const isWindowSelected = useCallback(
    (identifier: ProjectDetailsWindowIdentifier) =>
      selectedWindow === identifier,
    [selectedWindow]
  );

  return {
    selectedFile,
    setSelectedFile,
    selectedWindow,
    setSelectedWindow,
    isWindowSelected,
  };
};

export type ProjectDetailsContext = ReturnType<typeof useProjectDetailsStore>;

export const PROJECT_DETAILS_CONTEXT = createContext<ProjectDetailsContext>({
  selectedFile: null,
  setSelectedFile: () => {},
  selectedWindow: "project-explorer",
  setSelectedWindow: () => {},
  isWindowSelected: () => false,
});

export const useProjectDetailsContext = () =>
  useContext(PROJECT_DETAILS_CONTEXT);
