import type { IncomingMessage, Server } from 'node:http';
import type { Socket } from 'node:net';
import type { HttpRegistry } from '@/types/http/registry.js';
import { matchEndpoint } from './match-endpoint.js';
import { createWsHub } from './ws-hub.js';
import { upgradeWs } from './ws-upgrade.js';

export function attachHttpWebSockets(
  server: Server,
  registry: HttpRegistry,
): { detach: () => void } {
  const attached = registry.websockets().map((ws) => {
    const hub = createWsHub(ws.onMessage);
    const unsub = ws.subscribe?.(hub.broadcast);
    return { path: ws.path, hub, unsub };
  });
  const onUpgrade = (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const pathname = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
    const hit = matchEndpoint(attached, pathname);
    if (hit) {
      upgradeWs(req, socket, hit.hub, head);
      return;
    }
    socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
  };
  server.on('upgrade', onUpgrade);
  return {
    detach() {
      server.off('upgrade', onUpgrade);
      for (const item of attached) {
        item.unsub?.();
        item.hub.close();
      }
    },
  };
}
