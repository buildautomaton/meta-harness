import type { DashboardLayoutId } from './layouts.js';
import type { UiPlugin } from './plugin.js';

export function layoutPlugin(id: DashboardLayoutId): UiPlugin {
  return {
    name: `layout-${id}`,
    kind: 'layout',
    implementation: { layout: id },
  };
}
