import type { UiHooks, UiProviderContribution, UiSurface } from './plugin.js';

export const DEFAULT_PANELS = ['nav', 'sidebar', 'main'] as const;
export type DashboardPanelId = (typeof DEFAULT_PANELS)[number];

export type UiSlots = {
  surfaces: UiSurface[];
  providers: UiProviderContribution[];
  hooks: UiHooks[];
};

export function createUiSlots(): UiSlots {
  return { surfaces: [], providers: [], hooks: [] };
}
