import styled from "styled-components";
import type { WindowPaneProps } from "./WindowPane.types";
import { GridLayout, GridTemplate } from "@ubloimmo/uikit";
import { useMemo } from "react";

export const WindowPane = ({
  Header,
  Content,
  SideBar,
  active,
}: WindowPaneProps) => {
  const rows = useMemo<GridTemplate>(() => {
    if (Header) {
      if (SideBar || Content) {
        return ["s-9", "1fr"];
      }
      return ["s-9"];
    }
    return ["1fr"];
  }, [Header, SideBar, Content]);

  const columns = useMemo<GridTemplate>(() => {
    if (SideBar) return ["s-9", "1fr"];
    return ["1fr"];
  }, [SideBar]);

  return (
    <WindowContainer
      as="section"
      rows={rows}
      columns={columns}
      className={active ? "active" : ""}
      gap={0}
    >
      {Header && <Header active={active} />}
      {SideBar && <SideBar active={active} />}
      {Content && <Content active={active} />}
    </WindowContainer>
  );
};

const WindowContainer = styled(GridLayout)`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  flex-direction: column;
  background: var(--gray-50);
  --window-outline-color: var(--primary-light);
  border: 1px solid var(--window-outline-color);
  border-radius: var(--s-2);
  overflow: hidden;

  transition-property: background, box-shadow, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);

  &.active {
    --window-outline-color: var(--primary-medium);
    box-shadow: var(--shadow-card-elevation-medium);
  }
`;
