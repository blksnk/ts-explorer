import type { LayoutProps } from "./layout.types";
import styled from "styled-components";
import { GridItem, GridLayout } from "@ubloimmo/uikit";
import { Nav } from "../components";

export const RootLayout = ({ children }: LayoutProps) => {
  return (
    <Wrapper rows={["auto", "1fr"]} columns={1} fill gap="s-1">
      <GridItem column="1 / span 1" row="1 / span 1" fill>
        <Nav />
      </GridItem>
      <GridItem column="1 / span 1" row="2 / span 1" fill>
        {children}
      </GridItem>
    </Wrapper>
  );
};

const Wrapper = styled(GridLayout)`
  height: 100%;
  width: 100%;
  background: var(--white);
`;
