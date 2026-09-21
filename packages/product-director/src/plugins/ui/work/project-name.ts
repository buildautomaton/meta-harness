import type { WorkArtifact, WorkItem } from './types.js';
import { isDraftColumnItem } from './draft-column-item.js';
import { isQueuedItem } from './merge-items.js';

export function projectLabel(name: string): string {
  return name.trim() || 'No project';
}

export function sameProject(value: string | undefined, selected: string): boolean {
  return (value ?? '') === selected;
}

export function normalizeProjectName(value: string): string {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  return lower === 'inbox' || lower === 'no project' ? '' : trimmed;
}

function boardProject(item: WorkItem): boolean {
  return isDraftColumnItem(item) || isQueuedItem(item);
}

export function collectProjects(items: WorkItem[], artifacts: WorkArtifact[]): string[] {
  const names = new Set<string>();
  for (const item of items) if (boardProject(item)) names.add(item.project ?? '');
  for (const artifact of artifacts) names.add(artifact.project ?? '');
  const named = [...names].filter((name) => name.trim()).sort((a, b) => a.localeCompare(b));
  return names.has('') ? ['', ...named] : named;
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
