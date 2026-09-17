import type { Socket } from 'node:net';
import { encodeCloseFrame, encodePongFrame, encodeTextFrame } from './ws-frame.js';
import { attachWsReader } from './ws-decode.js';

export type WorkWsHub = {
  add(socket: Socket): void;
  broadcast(payload: unknown): void;
  close(): void;
};

export function createWorkWsHub(): WorkWsHub {
  const sockets = new Set<Socket>();
  return {
    add(socket) {
      sockets.add(socket);
      attachWsReader(socket, (opcode, payload) => {
        if (opcode === 0x8) {
          sockets.delete(socket);
          socket.end();
          return;
        }
        if (opcode === 0x9) socket.write(encodePongFrame(payload));
      });
      socket.on('close', () => sockets.delete(socket));
      socket.on('error', () => sockets.delete(socket));
    },
    broadcast(payload) {
      const frame = encodeTextFrame(JSON.stringify(payload));
      for (const socket of sockets) {
        try {
          socket.write(frame);
        } catch {
          sockets.delete(socket);
        }
      }
    },
    close() {
      const frame = encodeCloseFrame();
      for (const socket of sockets) {
        socket.write(frame);
        socket.end();
      }
      sockets.clear();
    },
  };
}
