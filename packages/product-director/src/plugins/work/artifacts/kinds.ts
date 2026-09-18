import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { ArtifactKind } from '@/types/artifact/kind.js';

export function hasArtifacts(input: SubmitWorkInput, kinds: ArtifactKind[]): boolean {
  const record = input as Record<string, unknown>;
  return kinds.some((kind) => record[kind.key] != null);
}

export function artifactKindsPresent(input: SubmitWorkInput, kinds: ArtifactKind[] = []): string[] {
  const record = input as Record<string, unknown>;
  if (!kinds.length) return Object.keys(record).filter((key) => isKindKey(key) && record[key] != null);
  return kinds.filter((kind) => record[kind.key] != null).map((kind) => kind.key);
}

function isKindKey(key: string): boolean {
  return !['title', 'description', 'sessionId', 'turnId', 'assets', 'questions'].includes(key);
}
