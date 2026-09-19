import type { RuntimePlugin } from '@/types/plugin.js';
import type { PluginSlots } from './plugin-slots.js';
import { storeContext } from './store-context.js';
import { runPluginMigrations } from './run-plugin-migrations.js';

/** Apply a package-defined plugin kind the kernel does not know. */
export function applyExtensionPlugin(slots: PluginSlots, plugin: RuntimePlugin): void {
  runPluginMigrations(slots, plugin);
  const impl = plugin.implementation ?? plugin.createFromStores?.(storeContext(slots));
  if (impl && typeof impl === 'object') {
    slots.extras[plugin.name] = impl;
    slots.extras[plugin.kind] = impl;
  }
}
