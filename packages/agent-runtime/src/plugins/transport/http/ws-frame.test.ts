import { describe, expect, it } from 'vitest';
import { decodeFrame } from './ws-decode.js';
import { encodeTextFrame } from './ws-frame.js';

describe('websocket frames', () => {
  it('round-trips a text notification', () => {
    const encoded = encodeTextFrame(JSON.stringify({ type: 'work.changed' }));
    const decoded = decodeFrame(encoded);
    expect(decoded?.opcode).toBe(0x1);
    expect(JSON.parse(decoded!.payload.toString())).toEqual({ type: 'work.changed' });
  });
});
