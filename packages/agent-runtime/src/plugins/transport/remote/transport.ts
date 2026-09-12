import type {
  CommandHost,
} from '../../../types/transport/implementation.js';
import type { HostTransport } from '../../../runtime/transport/types.js';
import type { RemoteCommand, RemoteTransportImplementation } from '../../../types/transport/options.js';
import { GET_SESSION_TOOL, LAUNCH_SUBAGENT_TOOL } from '../../tools/names.js';

export function createRemoteTransport(
  adapter: RemoteTransportImplementation,
): HostTransport {
  return {
    id: 'remote',
    async start(host: CommandHost) {
      await adapter.register({ cwd: host.cwd, tools: await host.listTools() });
      await adapter.subscribe((cmd) => dispatchRemoteCommand(host, cmd));
    },
    async stop() {
      await adapter.unsubscribe();
    },
  };
}

async function dispatchRemoteCommand(host: CommandHost, cmd: RemoteCommand): Promise<unknown> {
  const type = cmd.type;
  const name = cmd.name ?? (type === 'call_tool' ? undefined : type);
  const params = cmd.params ?? {};
  if (type === 'call_tool' && cmd.name) return host.callTool(cmd.name, params);
  if (name === LAUNCH_SUBAGENT_TOOL || name === GET_SESSION_TOOL || name) {
    return host.callTool(name, params);
  }
  throw new Error(`Unknown remote command: ${type}`);
}
