import type { UiPlugin } from './plugin.js';
import { createUiSlots, type UiSlots } from './slots.js';

export function applyUiPlugins(plugins: readonly UiPlugin[]): UiSlots {
  const slots = createUiSlots();
  for (const plugin of plugins) applyOne(slots, plugin);
  slots.surfaces.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  slots.providers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return slots;
}

function applyOne(slots: UiSlots, plugin: UiPlugin): void {
  if (plugin.hooks) slots.hooks.push(plugin.hooks);
  const impl = plugin.implementation;
  if (!impl) return;
  if (impl.surfaces) slots.surfaces.push(...impl.surfaces);
  if (impl.providers) slots.providers.push(...impl.providers);
}
