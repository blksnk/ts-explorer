import type { TooltipProps } from "@ubloimmo/uikit";

export type Breadcrumb = {
  label: string;
  path: string;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: TooltipProps;
};

export type BreadcrumbsProps = {
  crumbs: Breadcrumb[];
};
