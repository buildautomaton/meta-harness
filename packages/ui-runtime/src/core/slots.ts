import type { UiHooks, UiProviderContribution, UiSurface } from './plugin.js';
import { DEFAULT_LAYOUT, type DashboardLayoutId } from './layouts.js';

export { ALL_PANELS, DASHBOARD_LAYOUTS, DEFAULT_LAYOUT, DEFAULT_PANELS, LAYOUT_PANELS } from './layouts.js';
export type { DashboardLayoutId, DashboardPanelId } from './layouts.js';

export type UiSlots = {
  surfaces: UiSurface[];
  providers: UiProviderContribution[];
  hooks: UiHooks[];
  layout: DashboardLayoutId;
};

export function createUiSlots(): UiSlots {
  return { surfaces: [], providers: [], hooks: [], layout: DEFAULT_LAYOUT };
}
