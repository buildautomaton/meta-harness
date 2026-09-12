import { describe, expect, it } from 'vitest';
import { getSessionStatus } from './session-status.js';
import { createStreamBackend } from '../session/stream-backend.js';

describe('getSessionStatus', () => {
  it('returns summary from the transcript tail', async () => {
    const backend = createStreamBackend();
    await backend.create({
      id: 's1',
      harness: 'claude-code',
      model: 'sonnet',
      prompt: 'do work',
      cwd: '/repo',
      status: 'running',
      runId: 'r',
      createdAt: 't',
      updatedAt: 't',
    });
    await backend.append('s1', { ts: 't', kind: 'result', payload: { output: 'finished' } });
    const status = await getSessionStatus(backend, 's1');
    expect(status).toMatchObject({
      sessionId: 's1',
      harness: 'claude-code',
      model: 'sonnet',
      summary: 'finished',
    });
    expect(await getSessionStatus(backend, 'missing')).toBeNull();
  });
});
