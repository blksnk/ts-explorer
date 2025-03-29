import type { LayoutProps } from "./layout.types";
import styled from "styled-components";

export const RootLayout = ({ children }: LayoutProps) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.main`
  height: 100%;
  max-height: 100%;
  width: 100%;
  background: var(--white);
  padding: var(--s-2);
`;
