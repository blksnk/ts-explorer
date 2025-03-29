import type { IconName } from "@ubloimmo/uikit";
import type { ReactNode } from "react";

export type WindowHeaderProps = {
  active?: boolean;
  title?: ReactNode;
  actions?: ReactNode;
  icon?: IconName;
};
