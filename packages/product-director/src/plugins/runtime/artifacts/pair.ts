import type { ArtifactFile } from '@/types/work/artifact.js';
import { file } from '@plugins/runtime/work/artifacts/file.js';

export function pair(base: string, markdown: string, html: string): ArtifactFile[] {
  return [file(`${base}.md`, markdown), file(`${base}.html`, html)];
}
