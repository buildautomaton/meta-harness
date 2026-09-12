import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDiskBackend } from './disk-backend.js';

describe('createDiskBackend', () => {
  it('persists session metadata and transcript events', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-disk-'));
    try {
      const store = createDiskBackend(dir);
      await store.create({
        id: 'abc',
        harness: 'cursor-cli',
        prompt: 'hi',
        cwd: '/tmp',
        status: 'running',
        runId: 'run-1',
        createdAt: 't0',
        updatedAt: 't0',
      });
      await store.append('abc', { ts: 't1', kind: 'update', payload: { text: 'hello' } });
      await store.patch('abc', { status: 'completed' });
      const snap = await store.get('abc');
      expect(snap?.session.status).toBe('completed');
      expect(snap?.events).toHaveLength(1);
      expect((await store.list()).map((r) => r.id)).toEqual(['abc']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
