import { describe, expect, it } from 'vitest';
import { artifactTabLabel, previewHtmlFiles, visibleThumbs } from './preview-files.js';

describe('previewHtmlFiles', () => {
  it('keeps html paths, sorts preview order, and caps thumbs', () => {
    const files = [
      { path: 'algorithm.html' },
      { path: 'ui/home.html' },
      { path: 'notes.md' },
      { path: 'data-model.html' },
      { path: 'api.html' },
      { path: 'summary.html' },
    ];
    expect(previewHtmlFiles(files).map((f) => f.path)).toEqual([
      'summary.html',
      'api.html',
      'data-model.html',
      'ui/home.html',
      'algorithm.html',
    ]);
    expect(artifactTabLabel('ui/home.html')).toBe('home');
    expect(visibleThumbs([1, 2, 3, 4, 5, 6]).more).toBe(2);
  });
});
