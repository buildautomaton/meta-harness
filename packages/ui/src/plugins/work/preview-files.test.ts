import { describe, expect, it } from 'vitest';
import { artifactTabLabel, previewHtmlFiles, visibleThumbs } from './preview-files.js';

describe('previewHtmlFiles', () => {
  it('keeps html paths and caps visible thumbs', () => {
    const files = [
      { path: 'ui/home.html' },
      { path: 'notes.md' },
      { path: 'data-model.html' },
    ];
    expect(previewHtmlFiles(files).map((f) => f.path)).toEqual(['ui/home.html', 'data-model.html']);
    expect(artifactTabLabel('ui/home.html')).toBe('home');
    expect(visibleThumbs([1, 2, 3, 4, 5, 6]).more).toBe(2);
  });
});
