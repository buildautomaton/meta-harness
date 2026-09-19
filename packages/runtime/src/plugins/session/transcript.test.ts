import { describe, expect, it } from 'vitest';
import { compactAgentTranscript, transcriptTail } from './transcript.js';

describe('compactAgentTranscript', () => {
  it('joins agent message chunks and skips tool calls and thoughts', () => {
    const text = compactAgentTranscript([
      {
        ts: '1',
        kind: 'update',
        payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Hel' } },
      },
      {
        ts: '2',
        kind: 'update',
        payload: { sessionUpdate: 'tool_call', title: 'npm test', rawOutput: 'PASS' },
      },
      {
        ts: '3',
        kind: 'update',
        payload: { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'hmm' } },
      },
      {
        ts: '4',
        kind: 'update',
        payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'lo' } },
      },
      { ts: '5', kind: 'result', payload: { output: 'Hello' } },
    ]);
    expect(text).toBe('Hel\n\nlo');
  });

  it('falls back to result output when there are no agent messages', () => {
    expect(
      compactAgentTranscript([{ ts: '1', kind: 'result', payload: { output: 'done' } }]),
    ).toBe('done');
  });
});

describe('transcriptTail', () => {
  it('keeps the last characters of the compacted transcript', () => {
    const tail = transcriptTail(
      [{ ts: '1', kind: 'update', payload: { text: 'abcdefghij' } }],
      4,
    );
    expect(tail).toBe('ghij');
  });
});
