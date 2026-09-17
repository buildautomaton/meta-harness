import type { PluginInit } from '@/types/plugin.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { TransportPlugin } from '@/types/transport/plugin.js';
import type { StdioTransportOptions } from '@/types/transport/options.js';
import { createStdioTransport } from './transport.js';

export function stdioTransportPlugin(
  init: PluginInit<StdioTransportOptions, TransportHooks> = {},
): TransportPlugin {
  const transport = createStdioTransport(init.runtime?.log);
  return {
    name: 'transport-stdio',
    kind: 'transport',
    options: { id: init.options?.id ?? transport.id },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop },
    runtime: init.runtime,
  };
}
