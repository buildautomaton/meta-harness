import type { LogFn } from '@/types/log.js';
import type { FileStore } from '@/types/file-store/implementation.js';
import type { SqlStore } from '@/types/sql-store/implementation.js';
import type { RuntimePlugin } from '@/types/plugin.js';
import type { SessionImplementation } from '@/types/session/implementation.js';

export type StoreContext = {
  fileStore?: FileStore;
  sqlStore?: SqlStore;
  extras: Record<string, unknown>;
  byKind: Map<string, RuntimePlugin[]>;
};

export type HttpContributeContext = {
  cwd: string;
  log: LogFn;
  extras: Record<string, unknown>;
  pluginName: string;
  backend?: SessionImplementation;
  mount?: string;
  routes?: Record<string, string>;
};
