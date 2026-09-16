import type { ReactElement } from 'react';
import { applyUiPlugins } from './apply.js';
import type { UiPlugin } from './plugin.js';
import { DashboardApp } from '../dashboard/app.js';
import type { UiSlots } from './slots.js';

export type CreateUiOptions = {
  plugins: UiPlugin[];
};

export type UiHost = {
  slots: UiSlots;
  App: () => ReactElement;
};

export function createUi(options: CreateUiOptions): UiHost {
  const slots = applyUiPlugins(options.plugins);
  for (const hook of slots.hooks) hook.onReady?.();
  return {
    slots,
    App: () => DashboardApp({ slots }),
  };
}
