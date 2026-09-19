import type { RuntimePlugin } from '@/types/plugin.js';
import type { PluginRuntimeContext } from '@/types/plugin.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import type { CoreSetOptions } from './core-set.js';
import { httpTransportPlugin } from './transport/http/plugin.js';
import { stdioTransportPlugin } from './transport/stdio/plugin.js';
import { remoteTransportPlugin } from './transport/remote/plugin.js';
import { createHttpRemoteAdapter } from './transport/remote/http-adapter.js';
import { coreHttpEndpoints } from './core-set-http-endpoints.js';

export function coreSetTransport(
  opts: CoreSetOptions,
  init: { hooks?: CoreSetHooks; implementation?: CoreSetImplementation },
  shared: { runtime: PluginRuntimeContext },
): RuntimePlugin {
  if (opts.transport === 'remote') {
    const adapter =
      init.implementation?.transport ?? (opts.remoteUrl ? createHttpRemoteAdapter(opts.remoteUrl) : undefined);
    if (!adapter) throw new Error('Remote transport requires a RemoteTransportImplementation or remoteUrl');
    return remoteTransportPlugin({ implementation: adapter, hooks: init.hooks?.transport, ...shared });
  }
  if (opts.transport === 'stdio') {
    return stdioTransportPlugin({ hooks: init.hooks?.transport, ...shared });
  }
  return httpTransportPlugin({
    hooks: init.hooks?.transport,
    options: {
      host: opts.mcpHost,
      port: opts.mcpPort,
      path: opts.mcpPath,
      endpoints: coreHttpEndpoints(opts),
    },
    ...shared,
  });
}
