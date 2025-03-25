import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../api";
import {
  FlexColumnLayout,
  GridLayout,
  Heading,
  breakpointsPx,
} from "@ubloimmo/uikit";
import { ProjectCard, ResultWrapper } from "../../components";
import { PageLayout } from "../../layouts";
import styled from "styled-components";

export const ProjectListPage = () => {
  const api = useApi();

  const allProjects = useQuery({
    queryKey: api.queryKeys.project.list(),
    queryFn: api.endpoints.project.list,
  });

  return (
    <PageLayout>
      <FlexColumnLayout fill="row" gap="s-6">
        <Heading weight="medium">
          All ({allProjects.data?.data?.length ?? 0}) Projects
        </Heading>

        <PageGrid columns={2} gap="s-3" fill>
          <ResultWrapper
            result={allProjects.data}
            RenderData={(projects) =>
              projects.map((project) => (
                <ProjectCard project={project} key={project.id} />
              ))
            }
          />
        </PageGrid>
      </FlexColumnLayout>
    </PageLayout>
  );
};

const PageGrid = styled(GridLayout)`
  @media only screen and (max-width: ${breakpointsPx.XS}) {
    grid-template-columns: 1fr;
  }
`;
