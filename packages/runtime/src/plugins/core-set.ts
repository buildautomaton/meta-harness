import type { RuntimePlugin } from '@/types/plugin.js';
import type { PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { LogFn } from '@/types/log.js';
import type { TransportKind } from '@/types/transport/options.js';
import type { SessionBackendKind } from '@/types/session/options.js';
import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import { coreHarnessPlugins } from './harnesses/plugins.js';
import { diskSessionPlugin } from './session/disk/plugin.js';
import { streamSessionPlugin } from './session/stream/plugin.js';
import { defaultSessionsDir } from './session/create-backend.js';
import { minionToolsPlugin } from './tools/minion/plugin.js';
import { fileStorePlugin } from './stores/file/plugin.js';
import { sqlStorePlugin } from './stores/sql/plugin.js';
import { coreSetTransport } from './core-set-transport.js';

export type CoreSetOptions = {
  cwd: string;
  log?: LogFn;
  sessionsDir?: string;
  backend?: SessionBackendKind;
  transport?: TransportKind;
  remoteUrl?: string;
  mcpHost?: string;
  mcpPort?: number;
  mcpPath?: string;
  minionTools?: boolean;
  /** SQLite file for the sql-store plugin. Default: `<cwd>/.harness/work.sqlite`. */
  sqlFile?: string;
  /** Extra HTTP mounts, e.g. product-director work at `/api`. */
  httpEndpoints?: TransportEndpoint[];
};

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

/** Default plugin bundle: stores, harnesses, disk session, minion tools, HTTP. */
export function coreSet(
  init: PluginInit<CoreSetOptions, CoreSetHooks, CoreSetImplementation> & { options: CoreSetOptions },
): RuntimePlugin[] {
  const opts = init.options;
  const ctx: PluginRuntimeContext = init.runtime ?? { cwd: opts.cwd, log: opts.log ?? defaultLog };
  const dir = opts.sessionsDir ?? defaultSessionsDir(opts.cwd);
  const shared = { runtime: ctx };
  const plugins: RuntimePlugin[] = [
    fileStorePlugin({ options: { root: opts.cwd }, implementation: init.implementation?.fileStore, ...shared }),
    sqlStorePlugin({ options: { file: opts.sqlFile }, implementation: init.implementation?.sqlStore, ...shared }),
    ...coreHarnessPlugins({
      hooks: init.hooks?.harness,
      implementation: init.implementation?.harness,
      ...shared,
    }),
    diskSessionPlugin({
      options: { dir },
      hooks: init.hooks?.session,
      implementation: init.implementation?.session,
      ...shared,
    }),
  ];
  if (opts.minionTools !== false) {
    plugins.push(
      minionToolsPlugin({
        hooks: init.hooks?.tools,
        implementation: init.implementation?.tools,
        ...shared,
      }),
    );
  }
  if (opts.backend === 'stream') {
    plugins.push(
      streamSessionPlugin({
        hooks: init.hooks?.session,
        implementation: init.implementation?.session,
        ...shared,
      }),
    );
  }
  plugins.push(coreSetTransport(opts, init, shared));
  return plugins;
}
