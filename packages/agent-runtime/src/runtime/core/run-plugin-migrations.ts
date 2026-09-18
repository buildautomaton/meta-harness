import type { PluginSlots } from './plugin-slots.js';
import type { AgentRuntimePlugin } from '@/types/plugin.js';

export function runPluginMigrations(slots: PluginSlots, plugin: AgentRuntimePlugin): void {
  if (!plugin.sqlMigrations?.length || !slots.sqlStore) return;
  slots.sqlStore.migrate(plugin.name, plugin.sqlMigrations);
}
