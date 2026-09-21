import type { WorkArtifact, WorkItem } from './types.js';

export function projectLabel(name: string): string {
  return name.trim() || 'Inbox';
}

export function sameProject(value: string | undefined, selected: string): boolean {
  return (value ?? '') === selected;
}

export function normalizeProjectName(value: string): string {
  const trimmed = value.trim();
  return trimmed.toLowerCase() === 'inbox' ? '' : trimmed;
}

export function collectProjects(items: WorkItem[], artifacts: WorkArtifact[]): string[] {
  const names = new Set<string>();
  for (const item of items) names.add(item.project ?? '');
  for (const artifact of artifacts) names.add(artifact.project ?? '');
  const named = [...names].filter((name) => name.trim()).sort((a, b) => a.localeCompare(b));
  if (names.has('') || named.length === 0) return ['', ...named];
  return named;
}

export function mergeProjects(collected: string[], extra: string[]): string[] {
  const named = new Set(collected.filter((name) => name.trim()));
  for (const name of extra) {
    const next = name.trim();
    if (next) named.add(next);
  }
  const sorted = [...named].sort((a, b) => a.localeCompare(b));
  return collected.includes('') ? ['', ...sorted] : sorted;
}
