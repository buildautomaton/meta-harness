import { Buffer } from 'node:buffer';

export function encodeTextFrame(text: string): Buffer {
  const payload = Buffer.from(text);
  const len = payload.length;
  if (len < 126) return Buffer.concat([Buffer.from([0x81, len]), payload]);
  if (len < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
    return Buffer.concat([header, payload]);
  }
  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeUInt32BE(0, 2);
  header.writeUInt32BE(len, 6);
  return Buffer.concat([header, payload]);
}

export function encodeCloseFrame(): Buffer {
  return Buffer.from([0x88, 0x00]);
}

export function encodePongFrame(payload: Uint8Array = new Uint8Array()): Buffer {
  return Buffer.concat([Buffer.from([0x8a, payload.length]), Buffer.from(payload)]);
}
