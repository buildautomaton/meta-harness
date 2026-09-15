import { describe, expect, it } from 'vitest';
import { minionProgressSummary } from './progress-summary.js';

describe('minionProgressSummary', () => {
  it('lists pending permissions and recent tool calls without raw JSON', () => {
    const text = minionProgressSummary(
      [
        { type: 'tool_call', title: 'Read wait-minion.ts', name: 'Read', status: 'completed' },
        { type: 'tool_call', title: 'Shell git status', name: 'Shell', status: 'running' },
        { type: 'message', text: 'Looking at spawn wait next.' },
      ],
      [{ requestId: '1', kind: 'permission', method: 'session/request_permission', title: 'Permission needed', message: 'npm test' }],
    );
    expect(text).toContain('Waiting: Permission needed: npm test');
    expect(text).toContain('Read wait-minion.ts — completed');
    expect(text).toContain('Shell git status — running');
    expect(text).toContain('Looking at spawn wait next.');
    expect(text).not.toMatch(/[{[]/);
  });
});
