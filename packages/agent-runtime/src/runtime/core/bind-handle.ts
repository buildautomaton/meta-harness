import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { CommandHost } from '@/types/transport/implementation.js';
import type { HostTransport } from '@runtime/transport/types.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { ToolRegistry } from '@/types/tools/implementation.js';
import type { NotifierHub } from '@/types/notify.js';
import type { HttpRegistry } from '@/types/http/registry.js';
import type { RuntimeHandle } from './runtime-types.js';

export function bindHandle(opts: {
  cwd: string;
  engine: AcpEngine;
  transport: HostTransport;
  tools: ToolRegistry;
  transportHooks?: TransportHooks;
  notifier?: NotifierHub;
  http?: HttpRegistry;
}): RuntimeHandle {
  const { cwd, engine, transport, tools, transportHooks, notifier, http } = opts;
  const host: CommandHost = { cwd, listTools: tools.listTools, callTool: tools.callTool, notifier, http };
  return {
    cwd,
    engine,
    start: async () => {
      transportHooks?.onStart?.({ cwd });
      await transport.start(host);
    },
    stop: async () => {
      await transport.stop();
      transportHooks?.onStop?.();
      await engine.disconnect();
    },
  };
}
