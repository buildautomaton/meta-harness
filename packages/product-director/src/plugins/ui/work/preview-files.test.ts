import { describe, expect, it } from 'vitest';
import { artifactTabLabel, previewArtifactFiles, visibleThumbs } from './preview-files.js';

describe('previewArtifactFiles', () => {
  it('keeps markdown + ui html, sorts preview order, and caps thumbs', () => {
    const files = [
      { path: 'algorithm.md' },
      { path: 'ui/home.html' },
      { path: 'description.md' },
      { path: 'data-model.md' },
      { path: 'api.md' },
      { path: 'changes-overview.md' },
      { path: 'summary.md' },
      { path: 'summary.html' },
    ];
    expect(previewArtifactFiles(files).map((f) => f.path)).toEqual([
      'summary.md',
      'changes-overview.md',
      'api.md',
      'data-model.md',
      'ui/home.html',
      'algorithm.md',
    ]);
    expect(artifactTabLabel('ui/home.html')).toBe('home');
    expect(visibleThumbs([1, 2, 3, 4, 5, 6]).more).toBe(2);
  });
});
