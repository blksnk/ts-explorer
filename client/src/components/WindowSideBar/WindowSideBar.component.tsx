import styled from "styled-components";
import type { WindowSideBarProps } from "./WindowSideBar.types";
import { FlexColumnLayout } from "@ubloimmo/uikit";

export const WindowSideBar = ({
  children,
  active,
  ...props
}: WindowSideBarProps) => {
  return (
    <SideBarContainer as="aside" className={active ? "active" : ""} {...props}>
      {children}
    </SideBarContainer>
  );
};

const SideBarContainer = styled(FlexColumnLayout)`
  width: var(--s-9);
  min-width: var(--s-9);
  height: 100%;
  max-height: 100%;

  padding: var(--s-2) var(--s-1);

  --sidebar-outline-color: var(--primary-light);
  --sidebar-background: var(--white);

  background: var(--sidebar-background);
  border-right: 1px solid var(--sidebar-outline-color);
  z-index: 2;

  transition-property: background, box-shadow, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);

  &.active {
    --sidebar-outline-color: var(--primary-medium);
    --sidebar-background: var(--primary-light);
    box-shadow: var(--shadow-card-elevation-medium);
  }
`;
