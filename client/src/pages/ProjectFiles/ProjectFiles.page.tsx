import { useParams } from "react-router";
import { useApi } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "../../layouts";
import { FlexColumnLayout, Heading } from "@ubloimmo/uikit";
import { ResultWrapper } from "../../components";

export const ProjectFilesPage = () => {
  const { id } = useParams<{ id: string }>();

  const api = useApi();
  const projectFiles = useQuery({
    queryKey: api.queryKeys.project.files(id),
    queryFn: () => api.endpoints.project.files(id ?? ""),
  });

  console.log(projectFiles.data);

  return (
    <PageLayout>
      <ResultWrapper
        result={projectFiles.data}
        RenderData={(files) => (
          <>
            <FlexColumnLayout fill="row" gap="s-6">
              <Heading weight="medium">{files.length} files</Heading>
            </FlexColumnLayout>
          </>
        )}
      />
    </PageLayout>
  );
};
