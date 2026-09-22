import { describe, expect, it } from 'vitest';
import { handleAskWhatToWorkOn } from './ask-handle.js';
import { handleTellWhatWasBuilt } from './tell-handle.js';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import type { ToolContext } from '@buildautomaton/runtime';
import { builtinArtifactKinds } from '../artifacts/builtins.js';
import { ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT_DEFINITION } from './ask-def.js';
import { tellWhatWasBuiltDefinition } from './tell-def.js';

function toolCtx(work = createSqliteWorkBackend()): ToolContext {
  return {
    cwd: '/tmp',
    extras: { work, artifacts: builtinArtifactKinds() },
    engine: {} as ToolContext['engine'],
    backend: {} as ToolContext['backend'],
  };
}

describe('work MCP tools', () => {
  it('returns next work then records what was built', async () => {
    const work = createSqliteWorkBackend();
    await work.addWork({ title: 'Next', content: 'Do the next thing', queued: true });
    const ctx = toolCtx(work);
    const asked = await handleAskWhatToWorkOn(ctx);
    const structured = asked.structuredContent as { sessionId?: string };
    expect(structured.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    const told = await handleTellWhatWasBuilt(
      {
        title: 'Done',
        description: 'Built it',
        sessionId: structured.sessionId,
        project: 'Harness',
        summary: { areas: [{ area: 'Backend', description: 'Added a worker' }] },
      },
      ctx,
    );
    expect(told.content[0]!.text).toContain('Recorded "Done"');
    expect(told.structuredContent).toMatchObject({ sessionId: structured.sessionId });
  });

  it('waits until queued work appears when idle', async () => {
    const work = createSqliteWorkBackend();
    const pending = handleAskWhatToWorkOn(toolCtx(work));
    await work.addWork({ title: 'Next', content: 'Do the next thing', queued: true });
    const asked = await pending;
    expect(asked.content[0]!.text).toContain('Implement this queued work next');
  });

  it('returns drafts immediately without waiting for a queue', async () => {
    const work = createSqliteWorkBackend();
    await work.addWork({ title: 'Draft', content: 'Plan it' });
    const asked = await handleAskWhatToWorkOn(toolCtx(work));
    expect(asked.content[0]!.text).toContain('Drafts to interview');
    expect(asked.content[0]!.text).toContain('exactly one question');
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
    const told = await handleTellWhatWasBuilt(
      { title: 'Done', description: 'Built it', summary: { areas: [{ area: 'Backend', description: 'x' }] } },
      toolCtx(),
    );
    expect(told.isError).toBe(true);
    expect(told.content[0]!.text).toMatch(/project is required/i);
  });
});
