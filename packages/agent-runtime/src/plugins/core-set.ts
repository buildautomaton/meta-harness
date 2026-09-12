import type { AgentRuntimePlugin } from '../types/plugin.js';
import type { PluginInit, PluginRuntimeContext } from '../types/plugin.js';
import type { LogFn } from '../types/log.js';
import type { TransportKind } from '../types/transport/options.js';
import type { SessionBackendKind } from '../types/session/options.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import { coreHarnessPlugins } from './harnesses/plugins.js';
import { diskSessionPlugin } from './session/disk-plugin.js';
import { streamSessionPlugin } from './session/stream-plugin.js';
import { mcpTransportPlugin } from './transport/mcp/plugin.js';
import { remoteTransportPlugin } from './transport/remote/plugin.js';
import { createHttpRemoteAdapter } from './transport/http/adapter.js';
import { defaultSessionsDir } from './session/create-backend.js';
import { subagentToolsPlugin } from './tools/plugin.js';

export type CoreSetOptions = {
  cwd: string;
  log?: LogFn;
  sessionsDir?: string;
  backend?: SessionBackendKind;
  transport?: TransportKind;
  remoteUrl?: string;
};

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

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
    subagentToolsPlugin({
      hooks: init.hooks?.tools,
      implementation: init.implementation?.tools,
      ...shared,
    }),
  ];
  if (opts.backend === 'stream') {
    plugins.push(
      streamSessionPlugin({
        hooks: init.hooks?.session,
        implementation: init.implementation?.session,
        ...shared,
      }),
    );
  }
  if (opts.transport === 'remote') {
    const adapter =
      init.implementation?.transport ?? (opts.remoteUrl ? createHttpRemoteAdapter(opts.remoteUrl) : undefined);
    if (!adapter) throw new Error('Remote transport requires a RemoteTransportImplementation or remoteUrl');
    plugins.push(
      remoteTransportPlugin({
        implementation: adapter,
        hooks: init.hooks?.transport,
        ...shared,
      }),
    );
  } else {
    plugins.push(mcpTransportPlugin({ hooks: init.hooks?.transport, ...shared }));
  }
  return plugins;
}
