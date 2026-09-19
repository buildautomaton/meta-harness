import type { PluginSlots } from './plugin-slots.js';
import type { FileStorePlugin } from '@/types/file-store/plugin.js';

export function applyFileStorePlugin(slots: PluginSlots, plugin: FileStorePlugin): void {
  slots.fileStore = plugin.implementation;
}
