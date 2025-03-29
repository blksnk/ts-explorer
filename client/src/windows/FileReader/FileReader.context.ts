import { isObject, isString, type Nullish } from "@ubloimmo/front-util";
import { useApi, type FileId } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

export const useFileReaderStore = (id: Nullish<FileId>) => {
  const api = useApi();
  const fileData = useQuery({
    queryKey: api.queryKeys.file.get(id),
    queryFn: () => api.endpoints.file.get(id ?? 0),
  });

  const fileContent = useQuery({
    queryKey: api.queryKeys.file.content(id),
    queryFn: () => api.endpoints.file.content(id ?? 0),
  });

  const file = useMemo(() => {
    if (!isObject(fileData.data?.data) || !isString(fileContent.data?.data))
      return null;
    return {
      ...fileData.data.data,
      content: fileContent.data.data,
    };
  }, [fileData, fileContent]);

  const loading = useMemo(
    () => fileData.isLoading || fileContent.isLoading,
    [fileContent.isLoading, fileData.isLoading]
  );

  return {
    file,
    loading,
    id,
  };
};

export type FileReaderContext = ReturnType<typeof useFileReaderStore>;

export const FILE_READER_CONTEXT = createContext<FileReaderContext>({
  file: null,
  loading: true,
  id: null,
});

export const useFileReaderContext = () => useContext(FILE_READER_CONTEXT);
