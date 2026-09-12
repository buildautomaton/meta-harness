import { describe, expect, it } from 'vitest';
import { AcpPromptRoutingRegistry } from './acp-prompt-routing-registry.js';

describe('AcpPromptRoutingRegistry', () => {
  it('resolves routing per session+agent subprocess from the active streaming turn', () => {
    const registry = new AcpPromptRoutingRegistry();
    registry.registerRun({ sessionId: 'session-a', runId: 'run-a' });
    registry.registerRun({ sessionId: 'session-b', runId: 'run-b' });

    registry.setStreamingRunId('session-a::cursor-cli', 'run-a');
    registry.setStreamingRunId('session-b::claude-code', 'run-b');

    expect(registry.resolveRouting('session-a::cursor-cli')).toEqual({ sessionId: 'session-a', runId: 'run-a' });
    expect(registry.resolveRouting('session-b::claude-code')).toEqual({ sessionId: 'session-b', runId: 'run-b' });
    expect(registry.resolveRouting('session-a::codex')).toBeUndefined();
  });

  it('clears only the matching streaming turn for a session+agent subprocess', () => {
    const registry = new AcpPromptRoutingRegistry();
    registry.registerRun({ sessionId: 'session-a', runId: 'run-a' });
    registry.setStreamingRunId('session-a::cursor-cli', 'run-a');

    registry.clearStreamingRunId('session-a::cursor-cli', 'run-b');
    expect(registry.resolveRouting('session-a::cursor-cli')).toEqual({ sessionId: 'session-a', runId: 'run-a' });

    registry.clearStreamingRunId('session-a::cursor-cli', 'run-a');
    expect(registry.resolveRouting('session-a::cursor-cli')).toBeUndefined();
  });
});
