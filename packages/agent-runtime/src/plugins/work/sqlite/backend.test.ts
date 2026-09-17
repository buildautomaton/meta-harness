import { describe, expect, it } from 'vitest';
import { createSqliteWorkBackend } from './backend.js';

describe('sqlite work backend', () => {
  it('queues work, picks it with a session, and stores artifacts', async () => {
    const work = createSqliteWorkBackend();
    const item = await work.addWork({ title: 'Ship checkout', content: 'Build the checkout flow.', queued: true });
    expect(item.status).toBe('queued');

    const picked = await work.pickNextWork('session-1');
    expect(picked?.id).toBe(item.id);
    expect(picked?.status).toBe('in_progress');

    const artifact = await work.recordSubmission({
      title: 'Checkout',
      description: 'Added checkout page',
      sessionId: 'session-1',
      ui: { pages: [{ filename: 'checkout.html', title: 'Checkout', html: '<html><img src="logo.png"></html>' }] },
      assets: [{ filename: 'logo.png', mimeType: 'image/png', base64: 'aaaa' }],
      questions: {
        overview: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Checkout lives in ui/checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Change' },
            ],
          },
        ],
      },
    });
    expect(artifact.files.some((f) => f.path === 'ui/checkout.html' && f.content.includes('data:image/png'))).toBe(true);

    const queued = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'keep' },
    ]);
    expect(queued.queued[0]?.status).toBe('queued');
    expect(queued.queued[0]?.prompt).toBe('Keep this layout?');
    expect(queued.queued[0]?.agentContext).toContain('checkout.html');

    const again = await work.answerQuestions(artifact.id, [
      { subject: '__overview__', questionId: 'q1', choiceId: 'change' },
    ]);
    expect(again.queued[0]?.id).toBe(queued.queued[0]?.id);
    expect(again.queued[0]?.decisions).toEqual(['Change']);
  });
});
