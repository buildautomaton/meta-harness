export const DASHBOARD_LAYOUTS = ['sidebar', 'master-detail', 'columns'] as const;
export type DashboardLayoutId = (typeof DASHBOARD_LAYOUTS)[number];

export const ALL_PANELS = ['nav', 'sidebar', 'main', 'master', 'detail', 'column', 'header'] as const;
export type DashboardPanelId = (typeof ALL_PANELS)[number];

export const LAYOUT_PANELS: Record<DashboardLayoutId, readonly DashboardPanelId[]> = {
  sidebar: ['nav', 'sidebar', 'main'],
  'master-detail': ['nav', 'master', 'detail'],
  columns: ['nav', 'column', 'header'],
};

export const DEFAULT_LAYOUT: DashboardLayoutId = 'sidebar';
export const DEFAULT_PANELS = LAYOUT_PANELS.sidebar;
