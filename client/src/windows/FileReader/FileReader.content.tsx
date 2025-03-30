import { FlexLayout, Loading, type PaletteColor } from "@ubloimmo/uikit";
import type { WindowSlot } from "../../components";
import { useFileReaderContext } from "./FileReader.context";
import { useMemo } from "react";
import styled, { css } from "styled-components";
import { isString } from "@ubloimmo/front-util";

export const FileReaderContent: WindowSlot = ({ active }) => {
  const { loading, file } = useFileReaderContext();
  const loaderColor = useMemo<PaletteColor>(() => {
    if (active) return "primary-medium";
    return "primary-light";
  }, [active]);

  const innerHtml = useMemo(() => {
    if (!isString(file?.highlighted.html)) return undefined;
    return {
      __html: file.highlighted.html,
    };
  }, [file?.highlighted.html]);

  return (
    <>
      <CodeContainer dangerouslySetInnerHTML={innerHtml} $active={active} />
      <LoaderContainer align="center" justify="center" $loading={loading}>
        <Loading animation="Ripple" size="s-12" color={loaderColor} />
      </LoaderContainer>
    </>
  );
};

const CodeContainer = styled.div<{ $active?: boolean }>`
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  pre {
    padding: var(--s-2) var(--s-1);
    // account for truncated last empty line
    overflow-x: auto;

    code {
      min-width: 100%;
      display: inline-block;
    }

    &,
    code,
    span {
      background: none !important;
    }

    span.line {
      transition: background 150ms var(--bezier);
      width: 100%;
      display: inline-block;
      padding: 0 var(--s-1);
      border-radius: var(--s-1);

      &:hover {
        background: var(--primary-light-50) !important;
      }
    }

    &,
    & * {
      font-family: "JetBrains Mono" !important;
      line-height: var(--s-5);
      font-weight: var(--text-weight-medium);
      font-size: var(--text-s);
    }
  }
  ${({ $active }) =>
    !$active &&
    css`
      pre > * {
        opacity: 0.8;
        /* mix-blend-mode: luminosity; */
        filter: grayscale(0.5);
      }
    `}
`;

const LoaderContainer = styled(FlexLayout)<{ $loading?: boolean }>`
  inset: 0;
  position: absolute;
  opacity: 0;
  transition: opacity 300ms var(--bezier) 300ms;
  pointer-events: none;
  background: var(--gray-50);

  ${({ $loading }) =>
    $loading &&
    css`
      opacity: 1;
      transition: opacity 150ms var(--bezier) 0s;
      pointer-events: auto;
    `}
`;
