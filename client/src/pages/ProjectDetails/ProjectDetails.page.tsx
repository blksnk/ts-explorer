import { useParams } from "react-router";
import { useApi } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "../../layouts";
import { Divider, FlexColumnLayout, Heading, Text } from "@ubloimmo/uikit";
import { ResultWrapper } from "../../components";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const api = useApi();
  const projectData = useQuery({
    queryKey: api.queryKeys.project.get(id),
    queryFn: () => api.endpoints.project.get(id ?? ""),
  });

  const projectDetails = useQuery({
    queryKey: api.queryKeys.project.details(id),
    queryFn: () => api.endpoints.project.details(id ?? ""),
  });

  return (
    <PageLayout>
      <ResultWrapper
        result={projectData.data}
        RenderData={(project) => (
          <>
            <FlexColumnLayout fill="row" gap="s-6">
              <Heading weight="medium">{project.name}</Heading>
              <Divider />
              <ResultWrapper
                result={projectDetails.data}
                RenderData={() => (
                  <>
                    <Text>todo details</Text>
                  </>
                )}
              />
            </FlexColumnLayout>
          </>
        )}
      />
    </PageLayout>
  );
};
