import { describe, expect, it } from 'vitest';
import { handleAskWhatToWorkOn } from './ask-handle.js';
import { handleTellWhatWasBuilt } from './tell-handle.js';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import type { ToolContext } from '@buildautomaton/runtime';
import { builtinArtifactKinds } from '../artifacts/builtins.js';
import { ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION } from './ask-def.js';
import { tellWhatWasBuiltDefinition } from './tell-def.js';

function ctx(queued = true): Promise<ToolContext> {
  const work = createSqliteWorkBackend();
  const ready = queued
    ? work.addWork({ title: 'Next', content: 'Do the next thing', queued: true })
    : Promise.resolve();
  return ready.then(() => ({
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
    const structured = asked.structuredContent as { sessionId?: string };
    expect(structured.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(asked.content[0]!.text).toContain(`Session ID: ${structured.sessionId}`);

    const told = await handleTellWhatWasBuilt(
      {
        title: 'Done',
        description: 'Built it',
        sessionId: structured.sessionId,
        project: 'Harness',
        summary: {
          areas: [{ area: 'Backend', description: 'Added a worker' }],
        },
      },
      toolCtx,
    );
    expect(told.isError).toBeFalsy();
    expect(told.content[0]!.text).toContain('Recorded "Done"');
    expect(told.structuredContent).toMatchObject({ sessionId: structured.sessionId });
    expect((told.structuredContent as { artifactId: string }).artifactId).toBeTruthy();
  });

  it('still returns a sessionId state handle when there is no queued work', async () => {
    const asked = await handleAskWhatToWorkOn(await ctx(false));
    const structured = asked.structuredContent as { sessionId?: string };
    expect(structured.sessionId).toBeTruthy();
    expect(asked.content[0]!.text).toContain('No queued implementation work');
    expect(asked.content[0]!.text).toContain(`Session ID: ${structured.sessionId}`);
  });

  it('declares outputSchema for ask and tell state handles', () => {
    expect(ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION.outputSchema).toMatchObject({
      required: ['sessionId'],
    });
    expect(tellWhatWasBuiltDefinition(builtinArtifactKinds()).outputSchema).toMatchObject({
      required: ['artifactId'],
    });
  });

  it('requires project when recording what was built', async () => {
    const toolCtx = await ctx();
    const told = await handleTellWhatWasBuilt(
      {
        title: 'Done',
        description: 'Built it',
        summary: {
          areas: [{ area: 'Backend', description: 'Added a worker' }],
        },
      },
      toolCtx,
    );
    expect(told.isError).toBe(true);
    expect(told.content[0]!.text).toMatch(/project is required/i);
  });
});
