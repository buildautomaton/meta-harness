import type { ArtifactFile } from '@/types/work/artifact.js';

export function contentTypeForPath(path: string): string {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return 'text/plain; charset=utf-8';
}

export function file(path: string, content: string, contentType = contentTypeForPath(path)): ArtifactFile {
  return { path, content, contentType };
}
