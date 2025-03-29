import styled from "styled-components";
import { navStyles, navWrapperStyles } from "./Nav.styles";
import { FlexRowLayout, Heading } from "@ubloimmo/uikit";
import { Link } from "react-router";

export const Nav = () => {
  return (
    <Wrapper>
      <Container>
        <FlexRowLayout inline gap="s-1" align="baseline">
          <Link to="/">
            <Heading size="h4" weight="bold" color="primary-dark">
              TS Explorer
            </Heading>
          </Link>
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
