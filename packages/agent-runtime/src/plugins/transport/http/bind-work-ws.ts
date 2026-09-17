import type { IncomingMessage, Server } from 'node:http';
import type { Socket } from 'node:net';
import type { CommandHost } from '@/types/transport/implementation.js';
import type { ResolvedHttpEndpoint } from './match-endpoint.js';
import { matchEndpoint } from './match-endpoint.js';
import { createWorkWsHub, type WorkWsHub } from './ws-hub.js';
import { upgradeWorkWs } from './ws-upgrade.js';

function isWorkEvents(pathname: string, endpoints: ResolvedHttpEndpoint[]): boolean {
  const hit = matchEndpoint(endpoints, pathname);
  if (hit?.kind === 'work' && hit.surface === 'events') return true;
  return pathname === '/api/work/events' || pathname.endsWith('/work/events');
}

export function attachWorkWebSocket(
  server: Server,
  endpoints: ResolvedHttpEndpoint[],
  host: CommandHost,
): { hub: WorkWsHub; detach: () => void } {
  const hub = createWorkWsHub();
  const onUpgrade = (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
    if (isWorkEvents(pathname, endpoints)) {
      upgradeWorkWs(req, socket, hub, head);
      return;
    }
    socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
  };
  server.on('upgrade', onUpgrade);
  const unsubs = Object.values(host.plugins?.work ?? {}).map((work) =>
    work.subscribe?.((event) => hub.broadcast(event)),
  );
  return {
    hub,
    detach() {
      server.off('upgrade', onUpgrade);
      for (const unsub of unsubs) unsub?.();
      hub.close();
    },
  };
}
