import type { SubmitWorkInput } from '@/types/work/submit.js';
import { ARTIFACT_KIND_KEYS, type ArtifactKindKey } from '@/types/work/artifact.js';

export function hasArtifacts(input: SubmitWorkInput): boolean {
  return ARTIFACT_KIND_KEYS.some((key) => input[key] != null);
}

export function artifactKindsPresent(input: SubmitWorkInput): ArtifactKindKey[] {
  return ARTIFACT_KIND_KEYS.filter((key) => input[key] != null);
}
