import styled from "styled-components";
import { navStyles, navWrapperStyles } from "./Nav.styles";
import {
  FlexRowLayout,
  Heading,
  isNonEmptyString,
  Text,
} from "@ubloimmo/uikit";
import { Link, useLocation } from "react-router";
import { useMemo } from "react";
import { useApi } from "../../api";
import { useQuery } from "@tanstack/react-query";

export const Nav = () => {
  const location = useLocation();

  const crumbs = useMemo(
    () => location.pathname.split("/").filter(isNonEmptyString),
    [location.pathname]
  );

  const projectId = useMemo(() => {
    if (crumbs[0] === "projects" && isNonEmptyString(crumbs[1]))
      return crumbs[1];
    return null;
  }, [crumbs]);

  const api = useApi();

  const project = useQuery({
    queryKey: api.queryKeys.project.get(projectId),
    enabled: !!projectId,
    queryFn: () => (projectId ? api.endpoints.project.get(projectId) : null),
  });

  const displayCrumbs = useMemo(() => {
    if (project.isLoading || project.isError) return [];
    console.log(crumbs, project.data?.data);
    if (project.data?.data?.name)
      return [crumbs[0], project.data.data.name, ...crumbs.slice(2)];
    return crumbs;
  }, [crumbs, project.data, project.isError, project.isLoading]);

  return (
    <Wrapper>
      <Container>
        <FlexRowLayout inline gap="s-1" align="baseline">
          <Link to="/">
            <Heading size="h4" weight="bold" color="primary-dark">
              TS Explorer
            </Heading>
          </Link>
          {displayCrumbs.map((crumb, index) => (
            <>
              {index <= displayCrumbs.length - 1 && (
                <Text size="s" color="primary-base">
                  /
                </Text>
              )}
              <Text weight="medium" size="m" color="gray-700" capitalized>
                {crumb}
              </Text>
            </>
          ))}
        </FlexRowLayout>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  ${navWrapperStyles}
`;

const Container = styled.nav`
  ${navStyles}
`;
