import { describe, expect, it } from 'vitest';
import {
  awaitSdkStdioPermissionRequestHandshake,
  type PendingPermissionReplyMap,
} from './sdk-stdio-permission-request-handshake.js';

/** Mirrors `resolveRequest` in `sdk-stdio-acp-client.ts` (lookup + delete + resolve; no enrich here). */
function resolveLikeSdkStdioClient(
  pending: PendingPermissionReplyMap,
  requestId: string,
  result: unknown,
): void {
  const entry = pending.get(requestId);
  if (!entry) return;
  pending.delete(requestId);
  entry.resolve(result);
}

describe('awaitSdkStdioPermissionRequestHandshake', () => {
  it('registers pending before onRequest so sync resolve in onRequest settles the promise (dangerous auto-approve)', async () => {
    const pending: PendingPermissionReplyMap = new Map();
    const p = awaitSdkStdioPermissionRequestHandshake({
      requestId: 'perm-1',
      paramsRecord: { options: [] },
      pending,
      onRequest: ({ requestId }) => {
        resolveLikeSdkStdioClient(pending, requestId, {
          outcome: { outcome: 'selected' as const, optionId: 'allow-once' },
        });
      },
    });
    await expect(p).resolves.toEqual({
      outcome: { outcome: 'selected', optionId: 'allow-once' },
    });
    expect(pending.has('perm-1')).toBe(false);
  });

  it('if onRequest ran before pending registration, sync resolve would no-op and the promise would stay pending', async () => {
    const pending: PendingPermissionReplyMap = new Map();
    const wrongOrder = new Promise<unknown>((resolve) => {
      const requestId = 'perm-1';
      const paramsRecord: Record<string, unknown> = { options: [] };
      const onRequest = () => {
        resolveLikeSdkStdioClient(pending, requestId, { outcome: { outcome: 'selected', optionId: 'x' } });
      };
      onRequest();
      pending.set(requestId, { resolve, params: paramsRecord });
    });
    await expect(
      Promise.race([
        wrongOrder,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 50)),
      ]),
    ).rejects.toThrow('timeout');
  });
});
