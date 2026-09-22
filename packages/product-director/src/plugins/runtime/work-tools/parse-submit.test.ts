import { describe, expect, it } from 'vitest';
import { parseSubmitWork } from './parse-submit.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

describe('parseSubmitWork', () => {
  const kinds = builtinArtifactKinds();

  it('rejects a provided artifact kind that fails to parse', () => {
    const result = parseSubmitWork(
      {
        title: 'Done',
        description: 'Built it',
        project: 'Harness',
        ui: { pages: [{ filename: 'broken', title: 'x', html: '<div/>' }] },
      },
      kinds,
    );
    expect(result).toMatch(/ui was provided but could not be parsed/i);
  });

  it('keeps every successfully parsed artifact kind', () => {
    const result = parseSubmitWork(
      {
        title: 'Done',
        description: 'Built it',
        project: 'Harness',
        summary: { areas: [{ area: 'UI', description: 'Draft accept button' }] },
        changesOverview: {
          groups: [
            {
              description: 'Draft accept control',
              paths: [{ path: 'draft-accept.tsx', change: 'added' }],
            },
          ],
        },
        ui: {
          pages: [
            {
              filename: 'draft.html',
              title: 'Draft',
              html: '<div>Draft</div>',
              banner: { change: 'modified', text: 'Accept queues the draft' },
            },
          ],
        },
      },
      kinds,
    );
    expect(typeof result).toBe('object');
    if (typeof result === 'string') return;
    expect(result.summary).toBeTruthy();
    expect(result.changesOverview).toBeTruthy();
    expect(result.ui?.pages).toHaveLength(1);
  });
});
