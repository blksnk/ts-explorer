import type { ReactNode } from "react";
import { WindowPane } from "../../components";
import { FileReaderWindowHeader } from "./FileReader.header";
import type { FileReaderProps } from "./FileReader.types";
import { FileReaderProvider } from "./FileReader.provider";
import { FileReaderSideBar } from "./FileReader.sideBar";
import { FileReaderContent } from "./FileReader.content";
import { useProjectDetailsContext } from "../../pages/ProjectDetails/ProjectDetails.context";

export const FileReaderWindow = ({ fileId }: FileReaderProps): ReactNode => {
  const { selectedFile, isWindowSelected, setSelectedWindow } =
    useProjectDetailsContext();
  return (
    <FileReaderProvider fileId={selectedFile ?? fileId}>
      <WindowPane
        identifier="file-reader"
        active={isWindowSelected("file-reader")}
        onSelect={setSelectedWindow}
        Header={FileReaderWindowHeader}
        SideBar={FileReaderSideBar}
        Content={FileReaderContent}
      />
    </FileReaderProvider>
  );
};
