import { Link } from "react-router";
import styled from "styled-components";
import type { ProjectCardProps } from "./ProjectCard.types";
import { projectCardWrapperStyles } from "./ProjectCard.styles";
import { useMemo } from "react";
import {
  ContextInfoCard,
  Divider,
  FlexColumnLayout,
  FlexRowLayout,
  Heading,
  normalizeToDateStr,
} from "@ubloimmo/uikit";
import { useApi } from "../../api";
import { useQuery } from "@tanstack/react-query";
import { ResultWrapper } from "../ResultWrapper";

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const to = useMemo(() => `/projects/${project.id}`, [project.id]);
  const api = useApi();
  const projectDetails = useQuery({
    queryKey: api.queryKeys.project.details(project.id),
    queryFn: () => api.endpoints.project.details(project.id),
  });
  return (
    <ProjectCardWrapper to={to}>
      <FlexColumnLayout fill="row" gap="s-2">
        <Heading size="h2" weight="bold">
          {project.name}
        </Heading>
        <Divider />
        <ResultWrapper
          result={projectDetails.data}
          RenderData={(details) => (
            <FlexRowLayout fill="row" gap="s-2">
              <FlexColumnLayout align="center" fill="row" gap="s-2" wrap>
                <ContextInfoCard
                  icon={{ name: "FilesAlt" }}
                  label="Files"
                  title={String(details.fileCount)}
                />
                <ContextInfoCard
                  icon={{ name: "Git" }}
                  label="Nodes"
                  title={String(details.nodeCount)}
                />
              </FlexColumnLayout>
              <FlexColumnLayout align="center" fill="row" gap="s-2" wrap>
                <ContextInfoCard
                  icon={{ name: "ArrowLeftRight" }}
                  label="Imports"
                  title={String(details.fileImportCount)}
                />
                <ContextInfoCard
                  icon={{ name: "Database" }}
                  label="Last indexed"
                  title={normalizeToDateStr(project.updatedAt) ?? ""}
                />
              </FlexColumnLayout>
            </FlexRowLayout>
          )}
        />
      </FlexColumnLayout>
    </ProjectCardWrapper>
  );
};

const ProjectCardWrapper = styled(Link)`
  ${projectCardWrapperStyles}
`;
