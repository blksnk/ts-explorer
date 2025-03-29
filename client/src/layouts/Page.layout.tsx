import styled from "styled-components";
import type { LayoutProps } from "./layout.types";

export const PageLayout = ({ children }: LayoutProps) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.main`
  padding: var(--s-1);
  padding-top: 0;
  min-height: 100%;
  height: 100%;
  width: 100%;
`;
