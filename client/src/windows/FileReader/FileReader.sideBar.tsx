import { arrayOf, FlexColumnLayout, PaletteColor, Text } from "@ubloimmo/uikit";
import { WindowSideBar, type WindowSlot } from "../../components";
import { useFileReaderContext } from "./FileReader.context";
import { useMemo } from "react";
import styled from "styled-components";

export const FileReaderSideBar: WindowSlot = ({ active }) => {
  const { lineCount } = useFileReaderContext();

  const lineNumbers = useMemo(() => {
    if (!lineCount) return [];
    return arrayOf(lineCount, (index) => String(index + 1).padStart(2, "0"));
  }, [lineCount]);

  const color = useMemo<PaletteColor>(
    () => (active ? ("gray-600-70" as PaletteColor) : "gray-200"),
    [active]
  );

  return (
    <WindowSideBar active={active}>
      <FlexColumnLayout fill="row" align="end">
        {lineNumbers.map((number) => (
          <LineNumber size="s" align="right" fill key={number} color={color}>
            {number}
          </LineNumber>
        ))}
      </FlexColumnLayout>
    </WindowSideBar>
  );
};

const LineNumber = styled(Text)`
  white-space: nowrap;
  line-height: var(--s-5);
  font-size: 0.675rem;
`;
