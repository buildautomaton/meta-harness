import type { TransportPlugin, TransportPluginInit } from '@/types/transport/plugin.js';
import { createHttpTransport } from './transport.js';

export function httpTransportPlugin(init: TransportPluginInit = {}): TransportPlugin {
  const transport = createHttpTransport(init.options ?? {});
  return {
    name: 'transport-http',
    kind: 'transport',
    options: { id: init.options?.id ?? transport.id, ...init.options },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop, ...init.implementation },
    runtime: init.runtime,
  };
}
