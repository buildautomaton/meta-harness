import type { TransportPlugin, TransportPluginInit } from '../../../types/transport/plugin.js';
import { createMcpTransport } from './transport.js';

export function mcpTransportPlugin(init: TransportPluginInit = {}): TransportPlugin {
  const transport = createMcpTransport(init.options ?? {});
  return {
    name: 'transport-mcp',
    kind: 'transport',
    options: { id: init.options?.id ?? transport.id, ...init.options },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop, ...init.implementation },
    runtime: init.runtime,
  };
}
