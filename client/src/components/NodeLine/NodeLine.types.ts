import type { Nullable, VoidFn } from "@ubloimmo/front-util";
import type { ColorKeyOrWhite, IconName } from "@ubloimmo/uikit";
import type { ReactNode } from "react";

export type NodeLineProps = {
  icon: IconName;
  color?: ColorKeyOrWhite;
  active?: boolean;
  label: string;
  onClick?: Nullable<VoidFn>;
  children?: ReactNode;
  hidden?: boolean;
};

export type NodeLineDefaultProps = Required<NodeLineProps>;
