import { FlexRowLayout, Text } from "@ubloimmo/uikit";
import type { BreadcrumbsProps } from "./Breadcrumbs.types";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import styled from "styled-components";

export const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  if (!crumbs?.length) return null;
  return (
    <BreadcrumbContainer align="baseline" gap="s-2" justify="start">
      {crumbs.map((crumb, index) => (
        <Fragment key={crumb.path + String(index)}>
          {index > 0 && (
            <Text size="xs" color="gray-200">
              /
            </Text>
          )}
          <CrumbLink to={crumb.path}>
            <Text size="s" color="gray-600">
              {crumb.label}
            </Text>
          </CrumbLink>
        </Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

const BreadcrumbContainer = styled(FlexRowLayout)``;

const CrumbLink = styled(Link)`
  text-decoration: none;
  height: fit-content;

  & span {
    transition: color 150ms var(--bezier), opacity 150ms var(--bezier);
  }

  &:not(:last-child) span {
    opacity: 0.8;
  }

  &:not(:last-child):hover span {
    opacity: 1;
    text-decoration: underline;
  }

  &:last-child span {
    color: var(--primary-dark);
  }
`;
