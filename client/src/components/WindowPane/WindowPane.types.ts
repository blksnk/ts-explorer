import type { VoidFn } from "@ubloimmo/front-util";
import type { FC } from "react";

export type WindowSlot = FC<{ active?: boolean }>;

export type WindowPaneProps<TIdentifier extends string> = {
  active?: boolean;
  identifier: TIdentifier;
  onSelect?: VoidFn<[id: TIdentifier]>;
  Header?: WindowSlot;
  SideBar?: WindowSlot;
  Content?: WindowSlot;
};
