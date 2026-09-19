import type { PluginSlots } from './plugin-slots.js';
import type { RuntimePlugin } from '@/types/plugin.js';

export function runPluginMigrations(slots: PluginSlots, plugin: RuntimePlugin): void {
  if (!plugin.sqlMigrations?.length || !slots.sqlStore) return;
  slots.sqlStore.migrate(plugin.name, plugin.sqlMigrations);
}
