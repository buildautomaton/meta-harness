import type { AgentRuntimeManager } from './manager/types.js';
import type { CommandHost } from '../../types/transport/implementation.js';
import type { HostTransport } from '../transport/types.js';
import type { TransportHooks } from '../../types/transport/hooks.js';
import type { ToolRegistry } from '../../types/tools/implementation.js';
import type { RuntimeHandle } from './runtime-types.js';

export function bindHandle(opts: {
  cwd: string;
  manager: AgentRuntimeManager;
  transport: HostTransport;
  tools: ToolRegistry;
  transportHooks?: TransportHooks;
}): RuntimeHandle {
  const { cwd, manager, transport, tools, transportHooks } = opts;
  const host: CommandHost = { cwd, listTools: tools.listTools, callTool: tools.callTool };
  return {
    cwd,
    manager,
    start: async () => {
      transportHooks?.onStart?.({ cwd });
      await transport.start(host);
    },
    stop: async () => {
      await transport.stop();
      transportHooks?.onStop?.();
      await manager.disconnect();
    },
  };
}
