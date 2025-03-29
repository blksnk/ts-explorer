import type { ReactNode } from "react";
import { WindowPane } from "../../components";
import { FileReaderWindowHeader } from "./FileReader.header";
import type { FileReaderProps } from "./FileReader.types";
import { FileReaderProvider } from "./FileReader.provider";

export const FileReaderWindow = ({
  active,
  fileId,
}: FileReaderProps): ReactNode => {
  return (
    <FileReaderProvider fileId={fileId}>
      <WindowPane active={active} Header={FileReaderWindowHeader} />
    </FileReaderProvider>
  );
};
