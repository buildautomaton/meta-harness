import { describe, expect, it } from 'vitest';
import { createProgressReporter, progressTokenFromParams } from './progress-reporter.js';
import type { JsonRpcMessage } from './jsonrpc.js';
import type { McpSseHub } from './sse-hub.js';

function hub(broadcast: JsonRpcMessage[]): McpSseHub {
  return { broadcast: (msg: JsonRpcMessage) => broadcast.push(msg) } as unknown as McpSseHub;
}

describe('progressTokenFromParams', () => {
  it('reads a numeric token from _meta', () => {
    expect(progressTokenFromParams({ _meta: { progressToken: 3 } })).toBe(3);
  });
});

describe('createProgressReporter', () => {
  it('keeps progress tokens on the request notify channel', () => {
    const broadcast: JsonRpcMessage[] = [];
    const notified: JsonRpcMessage[] = [];
    const report = createProgressReporter(hub(broadcast), (msg) => notified.push(msg), 3);
    report({ message: 'Minion completed', progress: 311 });
    expect(broadcast.map((msg) => msg.method)).toEqual(['notifications/message']);
    expect(notified.map((msg) => msg.method)).toEqual([
      'notifications/progress',
      'notifications/message',
    ]);
    expect(notified[0]?.params).toMatchObject({
      progressToken: 3,
      progress: 311,
      message: 'Minion completed',
    });
  });

  it('does not broadcast progress when there is no request stream', () => {
    const broadcast: JsonRpcMessage[] = [];
    createProgressReporter(hub(broadcast), undefined, 2)({ message: 'Minion completed', progress: 372 });
    expect(broadcast.map((msg) => msg.method)).toEqual(['notifications/message']);
  });
});
