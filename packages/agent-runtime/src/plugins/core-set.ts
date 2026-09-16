import type { AgentRuntimePlugin } from '@/types/plugin.js';
import type { PluginInit, PluginRuntimeContext } from '@/types/plugin.js';
import type { LogFn } from '@/types/log.js';
import type { TransportKind } from '@/types/transport/options.js';
import type { SessionBackendKind } from '@/types/session/options.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import { coreHarnessPlugins } from './harnesses/plugins.js';
import { diskSessionPlugin } from './session/disk/plugin.js';
import { streamSessionPlugin } from './session/stream/plugin.js';
import { defaultSessionsDir } from './session/create-backend.js';
import { minionToolsPlugin } from './tools/minion/plugin.js';
import { sqliteWorkPlugin } from './work/sqlite/plugin.js';
import { workToolsPlugin } from './work-tools/plugin.js';
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
  /** Register minionToolsPlugin (default true). Other tools plugins can still be added. */
  minionTools?: boolean;
  /** Register sqlite work plugin + work MCP tools (default true). */
  work?: boolean;
  workFile?: string;
};

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

/**
 * Default plugin bundle: harnesses, disk session, minion tools, sqlite work,
 * then MCP (or remote). `minionTools: false` / `work: false` skip those plugins.
 */
export function coreSet(
  init: PluginInit<CoreSetOptions, CoreSetHooks, CoreSetImplementation> & { options: CoreSetOptions },
): AgentRuntimePlugin[] {
  const opts = init.options;
  const ctx: PluginRuntimeContext = init.runtime ?? { cwd: opts.cwd, log: opts.log ?? defaultLog };
  const dir = opts.sessionsDir ?? defaultSessionsDir(opts.cwd);
  const shared = { runtime: ctx };
  const plugins: AgentRuntimePlugin[] = [
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
  if (opts.work !== false) {
    plugins.push(
      sqliteWorkPlugin({
        options: { file: opts.workFile },
        hooks: init.hooks?.work,
        implementation: init.implementation?.work,
        ...shared,
      }),
      workToolsPlugin({ ...shared }),
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
