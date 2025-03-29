import type { FC } from "react";

export type WindowSlot = FC<{ active?: boolean }>;

export type WindowPaneProps = {
  active?: boolean;
  Header?: WindowSlot;
  SideBar?: WindowSlot;
  Content?: WindowSlot;
};
