import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import { wsAcceptKey } from './ws-accept.js';
import type { WorkWsHub } from './ws-hub.js';

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function upgradeWorkWs(req: IncomingMessage, socket: Socket, hub: WorkWsHub, head?: Buffer): void {
  const key = headerValue(req.headers['sec-websocket-key']);
  const upgrade = headerValue(req.headers.upgrade);
  socket.on('error', () => undefined);
  if (upgrade?.toLowerCase() !== 'websocket' || !key) {
    socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
    return;
  }
  socket.write(
    [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${wsAcceptKey(key)}`,
      '',
      '',
    ].join('\r\n'),
  );
  if (head?.length) socket.unshift(head);
  hub.add(socket);
}
