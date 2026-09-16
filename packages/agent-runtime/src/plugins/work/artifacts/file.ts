import type { ArtifactFile } from '@/types/work/artifact.js';

export function contentTypeForPath(path: string): string {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

export function file(path: string, content: string): ArtifactFile {
  return { path, content, contentType: contentTypeForPath(path) };
}
