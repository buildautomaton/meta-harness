import { describe, expect, it } from 'vitest';
import { handleAskInterviewQuestions } from './interview-handle.js';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import type { ToolContext } from '@buildautomaton/runtime';

const question = {
  id: 'scope',
  prompt: 'Guest checkout?',
  context: 'Decide whether checkout requires an account.',
  choices: [
    { id: 'guest', label: 'Allow guest' },
    { id: 'account', label: 'Account required' },
  ],
};

function ctx(work: ReturnType<typeof createSqliteWorkBackend>): ToolContext {
  return {
    cwd: '/tmp',
    extras: { work },
    engine: {} as ToolContext['engine'],
    backend: {} as ToolContext['backend'],
  };
}

describe('interview tool on deleted drafts', () => {
  it('drops questions for a draft that is already gone', async () => {
    const work = createSqliteWorkBackend();
    const draft = await work.addWork({ title: 'Checkout', content: 'Build checkout.' });
    await work.deleteWork(draft.id);
    const result = await handleAskInterviewQuestions(
      { workId: draft.id, questions: [question] },
      ctx(work),
    );
    expect(result.isError).toBeFalsy();
    expect(result.content[0]!.text).toMatch(/deleted/i);
    expect(await work.listWork()).toEqual([]);
  });
});
