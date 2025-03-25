import { css } from "styled-components";

export const projectCardWrapperStyles = () => css`
  background: var(--primary-light-20);
  box-shadow: var(--shadow-card-elevation-low);
  text-decoration: none;

  border-radius: var(--s-3);
  padding: var(--s-4) var(--s-1) var(--s-1);

  transition: box-shadow 300ms var(--bezier), background 300ms var(--bezier);

  &:hover {
    box-shadow: var(--shadow-card-elevation-medium);
    background: var(--primary-light);
    transition-duration: 150ms;
  }

  h2 {
    padding: 0 var(--s-4);
  }

  div[data-testid="divider"] {
    margin: 0 calc(var(--s-1) * -1);
    width: calc(100% + var(--s-2));
  }
`;
