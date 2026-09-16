import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from './apply.js';
import type { UiPlugin } from './plugin.js';

const queue: UiPlugin = {
  name: 'work-queue',
  kind: 'surface',
  implementation: {
    surfaces: [{ id: 'queue', title: 'Queue', panel: 'sidebar', component: () => null }],
  },
};

const theme: UiPlugin = {
  name: 'theme',
  kind: 'provider',
  implementation: {
    providers: [{ id: 'theme', component: ({ children }) => children }],
  },
};

describe('applyUiPlugins', () => {
  it('collects surfaces and providers from many plugins', () => {
    const slots = applyUiPlugins([theme, queue]);
    expect(slots.providers.map((p) => p.id)).toEqual(['theme']);
    expect(slots.surfaces.map((s) => s.id)).toEqual(['queue']);
  });
});
