import type { CommandHost } from '@/types/transport/implementation.js';
import type { LogFn } from '@/types/log.js';
import type { HostTransport } from '@runtime/transport/types.js';
import type { RemoteCommand, RemoteTransportImplementation } from '@/types/transport/options.js';
import { logToStderr } from '@plugins/transport/shared/log-to-stderr.js';

export function createRemoteTransport(
  adapter: RemoteTransportImplementation,
  log: LogFn = logToStderr,
): HostTransport {
  let unsub: (() => void) | undefined;
  return {
    id: 'remote',
    async start(host: CommandHost) {
      log('[Remote] Registering with control plane');
      const tools = await host.listTools();
      await adapter.register({ cwd: host.cwd, tools });
      log(`[Remote] Registered (${tools.map((t) => t.name).join(', ') || 'no tools'})`);
      unsub = host.notifier?.subscribe({
        notify: (event) => {
          adapter.publish?.({ sessionId: event.minionId, type: event.type, payload: event });
        },
      });
      await adapter.subscribe((cmd) => dispatchRemoteCommand(host, cmd));
      log('[Remote] Subscribed; ready for commands');
    },
    async stop() {
      log('[Remote] Stopping');
      unsub?.();
      await adapter.unsubscribe();
    },
  };
}

async function dispatchRemoteCommand(host: CommandHost, cmd: RemoteCommand): Promise<unknown> {
  const name = cmd.name ?? (cmd.type === 'call_tool' ? undefined : cmd.type);
  if (cmd.type === 'call_tool' && cmd.name) return host.callTool(cmd.name, cmd.params ?? {});
  if (name) return host.callTool(name, cmd.params ?? {});
  throw new Error(`Unknown remote command: ${cmd.type}`);
}
