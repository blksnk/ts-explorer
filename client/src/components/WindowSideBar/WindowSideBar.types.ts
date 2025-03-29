import type { FlexLayoutProps } from "@ubloimmo/uikit";

export type WindowSideBarProps = {
  active?: boolean;
} & Omit<FlexLayoutProps, "direction">;
