import { describe, expect, it } from 'vitest';
import { createMcpSseHub } from './sse-hub.js';
import type { JsonRpcMessage } from './jsonrpc.js';

describe('createMcpSseHub', () => {
  it('mirrors broadcasts and requests onto in-flight writers', async () => {
    const sse = createMcpSseHub();
    const seen: JsonRpcMessage[] = [];
    const detach = sse.addWriter((msg) => seen.push(msg));
    sse.broadcast({ jsonrpc: '2.0', method: 'notifications/message', params: { type: 'permission' } });
    const asked = sse.request('elicitation/create', { message: 'Allow?' });
    expect(seen.map((msg) => msg.method)).toEqual(['notifications/message', 'elicitation/create']);
    const id = seen[1]?.id;
    expect(id).toEqual(expect.any(Number));
    sse.complete(id as number, { action: 'accept' });
    await expect(asked).resolves.toEqual({ action: 'accept' });
    detach();
    sse.broadcast({ jsonrpc: '2.0', method: 'notifications/message' });
    expect(seen).toHaveLength(2);
    sse.close();
  });
});
