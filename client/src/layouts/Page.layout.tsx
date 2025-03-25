import styled from "styled-components";
import type { LayoutProps } from "./layout.types";

export const PageLayout = ({ children }: LayoutProps) => {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  padding: var(--s-1);
  padding-top: 0;
  min-height: 100%;
  height: 100%;
  width: 100%;
`;

const Container = styled.section`
  height: 100%;
  width: 100%;
  background: var(--white);
  border-radius: var(--s-2);
  box-shadow: var(--shadow-card-default);
  padding: var(--s-3);
`;
