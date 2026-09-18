import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { FileStore } from './implementation.js';
import type { FileStoreOptions } from './options.js';

export type FileStorePlugin = {
  name: string;
  kind: 'file-store';
  options?: FileStoreOptions;
  implementation: FileStore;
  runtime?: PluginRuntimeContext;
};

export type FileStorePluginFactory = PluginFactory<
  FileStoreOptions,
  object,
  Partial<FileStore>,
  FileStorePlugin
>;

export type FileStorePluginInit = PluginInit<FileStoreOptions, object, Partial<FileStore>>;
