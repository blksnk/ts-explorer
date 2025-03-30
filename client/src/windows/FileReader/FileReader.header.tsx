import { useMemo, type ReactNode } from "react";
import { WindowHeader, type WindowSlot } from "../../components";
import { useFileReaderContext } from "./FileReader.context";
import { isString } from "@ubloimmo/front-util";
import { Text } from "@ubloimmo/uikit";

/**
 * Header component for the File Reader window
 * @param {Object} props Component props
 * @param {boolean} props.active Whether the window is currently active/focused
 * @returns {ReactNode} Header component with file path or loading state
 */
export const FileReaderWindowHeader: WindowSlot = ({ active }): ReactNode => {
  const { file, loading } = useFileReaderContext();

  const normalizedPath = useMemo(() => {
    if (!isString(file?.path)) return null;
    return file.path
      .split("/")
      .map((part) => (part === ".." ? null : part))
      .filter(isString)
      .join("/");
  }, [file]);

  return (
    <WindowHeader
      active={active}
      icon="Code"
      title={
        loading ? (
          <Text size="s" color="gray-400">
            Loading...
          </Text>
        ) : normalizedPath ? (
          <Text
            size="s"
            weight="medium"
            fill
            ellipsis
            color={active ? "primary-dark" : "gray-700"}
          >
            {normalizedPath}
          </Text>
        ) : (
          <Text size="s" color="gray-400">
            No file selected
          </Text>
        )
      }
    />
  );
};
