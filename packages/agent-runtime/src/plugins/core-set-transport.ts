import type { AgentRuntimePlugin } from '@/types/plugin.js';
import type { PluginRuntimeContext } from '@/types/plugin.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import type { CoreSetOptions } from './core-set.js';
import { mcpTransportPlugin } from './transport/mcp/plugin.js';
import { remoteTransportPlugin } from './transport/remote/plugin.js';
import { createHttpRemoteAdapter } from './transport/remote/http-adapter.js';

export function coreSetTransport(
  opts: CoreSetOptions,
  init: { hooks?: CoreSetHooks; implementation?: CoreSetImplementation },
  shared: { runtime: PluginRuntimeContext },
): AgentRuntimePlugin {
  if (opts.transport === 'remote') {
    const adapter =
      init.implementation?.transport ?? (opts.remoteUrl ? createHttpRemoteAdapter(opts.remoteUrl) : undefined);
    if (!adapter) throw new Error('Remote transport requires a RemoteTransportImplementation or remoteUrl');
    return remoteTransportPlugin({ implementation: adapter, hooks: init.hooks?.transport, ...shared });
  }
  return mcpTransportPlugin({
    hooks: init.hooks?.transport,
    options: { host: opts.mcpHost, port: opts.mcpPort, path: opts.mcpPath },
    ...shared,
  });
}
