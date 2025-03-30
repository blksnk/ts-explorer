import styled from "styled-components";
import type { WindowPaneProps } from "./WindowPane.types";
import { FlexRowLayout, GridLayout } from "@ubloimmo/uikit";
import { useCallback } from "react";

export const WindowPane = <TIdentifier extends string>({
  identifier,
  Header,
  Content,
  SideBar,
  active,
  onSelect,
}: WindowPaneProps<TIdentifier>) => {
  const selectOnClick = useCallback(() => {
    if (onSelect) onSelect(identifier);
  }, [onSelect, identifier]);

  return (
    <WindowContainer
      as="section"
      className={active ? "active" : ""}
      onClick={selectOnClick}
    >
      {Header && <Header active={active} />}
      {(SideBar || Content) && (
        <WindowContentContainer fill>
          {SideBar && <SideBar active={active} />}
          {Content && <Content active={active} />}
        </WindowContentContainer>
      )}
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
  position: relative;

  transition-property: background, box-shadow, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);

  &.active {
    --window-outline-color: var(--primary-medium);
    box-shadow: var(--shadow-card-elevation-medium);
  }
`;

const WindowContentContainer = styled(FlexRowLayout)`
  height: 100%;
  width: 100%;
  max-height: 100%;
  max-width: 100%;
  overflow-y: auto;
`;
