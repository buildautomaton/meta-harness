export const PREVIEW_ORDER = [
  'summary',
  'changes-overview',
  'api',
  'data-model',
  'ui',
  'algorithm',
] as const;

function previewRank(path: string): number {
  if (path.startsWith('ui/') || path.startsWith('ui\\')) return PREVIEW_ORDER.indexOf('ui');
  const base = path.replace(/\.(html|md|json)$/i, '').split(/[/\\]/).pop() ?? path;
  const idx = PREVIEW_ORDER.indexOf(base as (typeof PREVIEW_ORDER)[number]);
  return idx === -1 ? PREVIEW_ORDER.length + 1 : idx;
}

export function previewHtmlFiles<T extends { path: string }>(files: T[]): T[] {
  return files
    .filter((file) => file.path.endsWith('.html'))
    .sort((a, b) => previewRank(a.path) - previewRank(b.path) || a.path.localeCompare(b.path));
}

export function artifactTabLabel(path: string): string {
  const name = path.replace(/\.(html|md|json)$/i, '').split('/').pop() ?? path;
  return name.replace(/[-_]/g, ' ');
}

export function visibleThumbs<T>(files: T[], limit = 5): { shown: T[]; more: number } {
  if (files.length <= limit) return { shown: files, more: 0 };
  return { shown: files.slice(0, limit - 1), more: files.length - (limit - 1) };
}
