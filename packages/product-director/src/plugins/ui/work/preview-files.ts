export function previewHtmlFiles<T extends { path: string }>(files: T[]): T[] {
  return files.filter((file) => file.path.endsWith('.html'));
}

export function artifactTabLabel(path: string): string {
  const name = path.replace(/\.(html|md|json)$/i, '').split('/').pop() ?? path;
  return name.replace(/[-_]/g, ' ');
}

export function visibleThumbs<T>(files: T[], limit = 5): { shown: T[]; more: number } {
  if (files.length <= limit) return { shown: files, more: 0 };
  return { shown: files.slice(0, limit - 1), more: files.length - (limit - 1) };
}
