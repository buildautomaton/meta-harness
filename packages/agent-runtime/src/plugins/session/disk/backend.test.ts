import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDiskBackend } from './backend.js';
import { compactSessionLog, markdownFromLog } from '@plugins/session/compact-log.js';

const record = {
  id: 'abc',
  harness: 'cursor-cli',
  prompt: 'hi',
  cwd: '/tmp',
  status: 'running' as const,
  runId: 'run-1',
  createdAt: 't0',
  updatedAt: 't0',
};

describe('createDiskBackend', () => {
  it('appends jsonl while running, then compacts to md and structured log', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-disk-'));
    try {
      const store = createDiskBackend(dir);
      await store.create(record);
      const events = [
        { ts: 't1', kind: 'update' as const, payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Hel' } } },
        { ts: 't2', kind: 'update' as const, payload: { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'hmm' } } },
        { ts: 't3', kind: 'update' as const, payload: { sessionUpdate: 'tool_call', toolCallId: 'c1', name: 'ls' } },
        { ts: 't4', kind: 'update' as const, payload: { sessionUpdate: 'tool_call_update', toolCallId: 'c1', status: 'completed', rawOutput: 'ok' } },
        { ts: 't5', kind: 'update' as const, payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'lo' } } },
      ];
      for (const event of events) await store.append('abc', event);
      expect(existsSync(join(dir, 'abc.jsonl'))).toBe(true);
      expect(existsSync(join(dir, 'abc.md'))).toBe(false);
      expect((await store.get('abc'))?.events).toHaveLength(5);
      const log = compactSessionLog(events);
      await store.compact?.('abc', { transcript: markdownFromLog(log), log });
      expect(existsSync(join(dir, 'abc.jsonl'))).toBe(false);
      expect(readFileSync(join(dir, 'abc.md'), 'utf8')).toBe('Hel\n\nlo\n');
      const meta = JSON.parse(readFileSync(join(dir, 'abc.json'), 'utf8'));
      expect(meta.log.map((row: { type: string }) => row.type)).toEqual([
        'message',
        'thought',
        'tool_call',
        'message',
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
