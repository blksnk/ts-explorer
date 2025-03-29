import type { ReactNode } from "react";
import type { FileId } from "../../api";
import type { Nullish } from "@ubloimmo/front-util";
import { FILE_READER_CONTEXT, useFileReaderStore } from "./FileReader.context";

/**
 * Provider component for the File Reader context
 * @param {Object} props Component props
 * @param {ReactNode} [props.children] Child components to render within the provider
 * @param {Nullish<FileId>} [props.fileId] ID of the file to load
 * @returns {ReactNode} Provider component
 */
export const FileReaderProvider = ({
  children,
  fileId,
}: {
  children?: ReactNode;
  fileId?: Nullish<FileId>;
}): ReactNode => {
  const store = useFileReaderStore(fileId);

  return (
    <FILE_READER_CONTEXT.Provider value={store}>
      {children}
    </FILE_READER_CONTEXT.Provider>
  );
};
