export const PREVIEW_ORDER = [
  'summary',
  'changes-overview',
  'api',
  'data-model',
  'ui',
  'algorithm',
] as const;

const SKIP_MD = new Set(['description.md']);

function previewRank(path: string): number {
  if (path.startsWith('ui/') || path.startsWith('ui\\')) return PREVIEW_ORDER.indexOf('ui');
  const base = path.replace(/\.(html|md|json)$/i, '').split(/[/\\]/).pop() ?? path;
  const idx = PREVIEW_ORDER.indexOf(base as (typeof PREVIEW_ORDER)[number]);
  return idx === -1 ? PREVIEW_ORDER.length + 1 : idx;
}

/** UI stays HTML; other artifacts preview from markdown. */
export function previewArtifactFiles<T extends { path: string }>(files: T[]): T[] {
  return files
    .filter((file) => isPreviewPath(file.path))
    .sort((a, b) => previewRank(a.path) - previewRank(b.path) || a.path.localeCompare(b.path));
}

export function isPreviewPath(path: string): boolean {
  if (path.startsWith('ui/') || path.startsWith('ui\\')) return path.endsWith('.html');
  if (path.endsWith('.md')) return !SKIP_MD.has(path.split(/[/\\]/).pop() ?? path);
  return false;
}

export function artifactTabLabel(path: string): string {
  const name = path.replace(/\.(html|md|json)$/i, '').split('/').pop() ?? path;
  return name.replace(/[-_]/g, ' ');
}

export function visibleThumbs<T>(files: T[], limit = 5): { shown: T[]; more: number } {
  if (files.length <= limit) return { shown: files, more: 0 };
  return { shown: files.slice(0, limit - 1), more: files.length - (limit - 1) };
}
