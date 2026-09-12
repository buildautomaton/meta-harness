import type { PluginInit } from '../../../types/plugin.js';
import type { TransportHooks } from '../../../types/transport/hooks.js';
import type { TransportPlugin } from '../../../types/transport/plugin.js';
import type { RemoteTransportOptions, RemoteTransportImplementation } from '../../../types/transport/options.js';
import { createRemoteTransport } from './transport.js';

export function remoteTransportPlugin(
  init: PluginInit<RemoteTransportOptions, TransportHooks, RemoteTransportImplementation> & {
    implementation: RemoteTransportImplementation;
  },
): TransportPlugin {
  const transport = createRemoteTransport(init.implementation);
  return {
    name: 'transport-remote',
    kind: 'transport',
    options: { id: init.options?.id ?? transport.id },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop },
    runtime: init.runtime,
  };
}
