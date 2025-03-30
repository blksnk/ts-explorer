import {
  StaticIcon,
  Text,
  useHtmlAttribute,
  useMergedProps,
} from "@ubloimmo/uikit";
import type { NodeLineDefaultProps, NodeLineProps } from "./NodeLine.types";
import styled, { css } from "styled-components";
import { useMemo } from "react";
import { isFunction, VoidFn } from "@ubloimmo/front-util";

const defaultNodeLineProps: NodeLineDefaultProps = {
  label: "",
  icon: "ArrowLeftShort",
  color: "primary",
  active: false,
  onClick: null,
  children: null,
};

/**
 * A line component that displays an icon and label with optional click interaction
 * @param {NodeLineProps} props - The component props
 * @param {IconName} props.icon - The icon to display
 * @param {ColorKeyOrWhite} [props.color="primary"] - The color theme for the icon when active
 * @param {boolean} [props.active=false] - Whether the line is in active state
 * @param {string} props.label - The text label to display
 * @param {Nullable<VoidFn>} [props.onClick=null] - Optional click handler function
 * @returns {JSX.Element} The rendered NodeLine component
 */
export const NodeLine = (props: NodeLineProps) => {
  const { active, color, icon, label, onClick, children } = useMergedProps(
    defaultNodeLineProps,
    props
  );
  const iconColor = useMemo(() => (active ? color : "gray"), [active, color]);
  const clickable = useMemo(() => isFunction<VoidFn>(onClick), [onClick]);
  const handleClick = useHtmlAttribute(onClick);

  return (
    <NodeLineContainer $clickable={clickable} onClick={handleClick}>
      <StaticIcon name={icon} color={iconColor} size="xs" />
      <Text size="xs" color="gray-600">
        {label}
      </Text>
      {children}
    </NodeLineContainer>
  );
};

export const NodeLineContainer = styled.article<{ $clickable?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  gap: var(--s-1);
  padding: var(--s-2) var(--s-1);
  background: var(--white);
  transition: background 150ms var(--bezier);

  position: relative;

  span[data-testid="text"] {
    flex: 1;
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      &:hover {
        background: var(--gray-100-50);

        span[data-testid="text"] {
          color: var(--primary-base);
        }
      }
    `}
`;
