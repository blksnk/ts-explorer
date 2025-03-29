import styled from "styled-components";
import type { WindowHeaderProps } from "./WindowHeader.types";
import { StaticIcon } from "@ubloimmo/uikit";

export const WindowHeader = ({
  active,
  title,
  actions,
  icon,
}: WindowHeaderProps) => {
  return (
    <Header className={active ? "active" : ""}>
      {icon && (
        <IconContainer>
          <StaticIcon
            name={icon}
            color={active ? "primary" : "gray"}
            size="s"
          />
        </IconContainer>
      )}
      <Content>
        {title}
        {actions}
      </Content>
    </Header>
  );
};

const Header = styled.header`
  width: 100%;
  min-height: var(--s-9);
  max-height: var(--s-9);
  height: var(--s-9);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  --header-outline-color: var(--primary-light);
  --header-background: var(--white);
  z-index: 1;

  transition-property: background, box-shadow, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);

  &.active {
    --header-outline-color: var(--primary-medium);
    --header-background: var(--primary-light);
    box-shadow: var(--shadow-card-elevation-medium);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--s-9);
  min-width: var(--s-9);
  height: var(--s-9);
  min-height: var(--s-9);
  aspect-ratio: 1;
  border-right: 1px solid var(--header-outline-color);
  border-bottom: 1px solid var(--header-outline-color);
  background: var(--header-background);

  transition-property: background, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);

  header.active & {
    background: var(--header-outline-color);
  }
`;

const Content = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: var(--s-1);
  padding-left: var(--s-2);
  border-bottom: 1px solid var(--header-outline-color);
  background: var(--header-background);

  transition-property: background, border;
  transition-duration: 150ms;
  transition-timing-function: var(--bezier);
`;
