import type { PluginSlots } from './plugin-slots.js';
import type { SqlStorePlugin } from '@/types/sql-store/plugin.js';

export function applySqlStorePlugin(slots: PluginSlots, plugin: SqlStorePlugin): void {
  slots.sqlStore = plugin.implementation;
}
