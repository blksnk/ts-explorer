import {
  FlexColumnLayout,
  GridItem,
  StaticIcon,
  Text,
  type ColorKeyOrWhite,
  type PaletteColor,
} from "@ubloimmo/uikit";
import { useMemo, type ReactNode } from "react";
import styled from "styled-components";
import type { FileFlowNodeHeaderProps } from "./FileFlowNode.types";

/**
 * Header component for a file node in the flow diagram.
 * Displays the file name, path and an icon with dynamic styling based on selection state.
 *
 * @param {FileFlowNodeHeaderProps} props - Component props
 * @param {ProjectFile} props.data - File data containing name and path
 * @param {boolean} props.selected - Whether the node is currently selected
 * @returns {ReactNode} Rendered file node header
 */
export const FileFlowNodeHeader = ({
  data,
  selected,
}: FileFlowNodeHeaderProps): ReactNode => {
  const iconColor = useMemo<ColorKeyOrWhite>(
    () => (selected ? "primary" : "gray"),
    [selected]
  );
  const textColor = useMemo<PaletteColor>(
    () => (selected ? "primary-dark" : "gray-700"),
    [selected]
  );
  const subTextColor = useMemo<PaletteColor>(
    () => (selected ? "gray-700" : "gray-600"),
    [selected]
  );

  const path = useMemo(() => data.path.replaceAll("/", " / "), [data.path]);

  return (
    <Header>
      <GridItem>
        <StaticIcon name="FileCode" color={iconColor} size="xs" />
      </GridItem>
      <GridItem fill="force">
        <Content gap="s-1">
          <Text size="m" weight="medium" color={textColor} fill>
            {data.name}
          </Text>
          <Text size="xs" color={subTextColor} fill>
            {path}
          </Text>
        </Content>
      </GridItem>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  gap: var(--s-1);
  background: var(--white);
  border-top-left-radius: var(--s-2);
  border-top-right-radius: var(--s-2);
  padding: var(--s-1) var(--s-1) var(--s-2);
`;

const Content = styled(FlexColumnLayout)`
  padding-top: calc(var(--s-05) * 0.5);

  span[data-testid="text"] {
  }
`;
