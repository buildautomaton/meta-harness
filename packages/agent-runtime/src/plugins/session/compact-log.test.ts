import { describe, expect, it } from 'vitest';
import { compactSessionLog, markdownFromLog } from './compact-log.js';

describe('compactSessionLog', () => {
  it('merges message chunks and tool call updates', () => {
    const log = compactSessionLog([
      {
        ts: '1',
        kind: 'update',
        payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Hel' } },
      },
      {
        ts: '2',
        kind: 'update',
        payload: { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'hmm' } },
      },
      {
        ts: '3',
        kind: 'update',
        payload: { sessionUpdate: 'tool_call', toolCallId: 't1', name: 'ls', rawInput: { path: '.' } },
      },
      {
        ts: '4',
        kind: 'update',
        payload: { sessionUpdate: 'tool_call_update', toolCallId: 't1', status: 'completed', rawOutput: 'ok' },
      },
      {
        ts: '5',
        kind: 'update',
        payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'lo' } },
      },
    ]);
    expect(log).toMatchObject([
      { type: 'message', text: 'Hel' },
      { type: 'thought', text: 'hmm' },
      { type: 'tool_call', toolCallId: 't1', name: 'ls', status: 'completed', output: 'ok' },
      { type: 'message', text: 'lo' },
    ]);
    expect(markdownFromLog(log)).toBe('Hel\n\nlo');
  });
});
