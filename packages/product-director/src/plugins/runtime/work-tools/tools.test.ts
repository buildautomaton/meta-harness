import { describe, expect, it } from 'vitest';
import { handleAskWhatToWorkOn } from './ask-handle.js';
import { handleTellWhatWasBuilt } from './tell-handle.js';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import type { ToolContext } from '@buildautomaton/runtime';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

function ctx(): Promise<ToolContext> {
  const work = createSqliteWorkBackend();
  return work.addWork({ title: 'Next', content: 'Do the next thing', queued: true }).then(() => ({
    cwd: '/tmp',
    extras: { work, artifacts: builtinArtifactKinds() },
    engine: {} as ToolContext['engine'],
    backend: {} as ToolContext['backend'],
  }));
}

describe('work MCP tools', () => {
  it('returns next work then records what was built', async () => {
    const toolCtx = await ctx();
    const asked = await handleAskWhatToWorkOn(toolCtx);
    expect(asked.isError).toBeFalsy();
    const text = asked.content[0]!.text;
    expect(text).toContain('Session ID:');
    const sessionId = text.split('\n')[0]!.replace('Session ID: ', '');

    const told = await handleTellWhatWasBuilt(
      {
        title: 'Done',
        description: 'Built it',
        sessionId,
        backend: { description: 'Added a worker' },
      },
      toolCtx,
    );
    expect(told.isError).toBeFalsy();
    expect(told.content[0]!.text).toContain('Recorded "Done"');
  });
});
