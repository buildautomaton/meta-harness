import type { FileStorePlugin, FileStorePluginInit } from '@/types/file-store/plugin.js';
import { createNodeFileStore } from './store.js';

export function fileStorePlugin(init: FileStorePluginInit = {}): FileStorePlugin {
  const root = init.options?.root ?? init.runtime?.cwd ?? process.cwd();
  return {
    name: 'store-file',
    kind: 'file-store',
    options: { root, id: init.options?.id ?? 'file' },
    implementation: { ...createNodeFileStore(root), ...init.implementation },
    runtime: init.runtime,
  };
}
