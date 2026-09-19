import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { workUiPlugin } from './plugin.js';

describe('workUiPlugin', () => {
  it('uses the columns layout with completed, draft, and queued surfaces', () => {
    const slots = applyUiPlugins([workUiPlugin()]);
    expect(slots.layout).toBe('columns');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual([
      'nav:work-nav',
      'column:work-completed',
      'column:work-draft',
      'column:work-queued',
    ]);
  });
});
