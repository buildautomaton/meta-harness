import { describe, expect, it } from 'vitest';
import { encodeStdioMessage, pullStdioMessage } from './framing.js';

describe('stdio MCP framing', () => {
  it('round-trips a JSON-RPC body', () => {
    const payload = '{"jsonrpc":"2.0","id":1,"method":"initialize"}';
    const framed = encodeStdioMessage(payload);
    const pulled = pullStdioMessage(framed);
    expect(pulled?.message).toBe(payload);
    expect(pulled?.rest.length).toBe(0);
  });
});
