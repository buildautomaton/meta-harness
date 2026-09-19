import type { Socket } from 'node:net';
import { Buffer } from 'node:buffer';

export type WsFrame = { opcode: number; payload: Buffer; rest: Buffer<ArrayBufferLike> };

export function decodeFrame(buffer: Buffer<ArrayBufferLike>): WsFrame | null {
  if (buffer.length < 2) return null;
  const opcode = buffer[0]! & 0x0f;
  const masked = (buffer[1]! & 0x80) !== 0;
  let len = buffer[1]! & 0x7f;
  let offset = 2;
  if (len === 126) {
    if (buffer.length < 4) return null;
    len = buffer.readUInt16BE(2);
    offset = 4;
  } else if (len === 127) {
    if (buffer.length < 10) return null;
    len = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }
  if (masked) offset += 4;
  if (buffer.length < offset + len) return null;
  const raw = buffer.subarray(offset, offset + len);
  const payload = Buffer.from(raw);
  if (masked) {
    const mask = buffer.subarray(offset - 4, offset);
    for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i % 4]!;
  }
  return { opcode, payload, rest: Buffer.from(buffer.subarray(offset + len)) };
}

export function attachWsReader(socket: Socket, onFrame: (opcode: number, payload: Buffer) => void): void {
  let buf: Buffer<ArrayBufferLike> = Buffer.from([]);
  socket.on('data', (chunk: Buffer) => {
    buf = Buffer.concat([buf, chunk]);
    let frame = decodeFrame(buf);
    while (frame) {
      onFrame(frame.opcode, frame.payload);
      buf = frame.rest;
      frame = decodeFrame(buf);
    }
  });
}
