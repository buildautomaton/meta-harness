import type { ArtifactFile } from '@/types/work/artifact.js';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { WorkAssetInput } from '@/types/work/events.js';
import type { ArtifactKind } from '@/types/artifact/kind.js';
import { file } from './file.js';
import { buildQuestionsFile } from './questions-file.js';
import { dataUri } from './embed-assets.js';
import { artifactKindsPresent } from './kinds.js';

export function buildArtifactFiles(
  input: SubmitWorkInput,
  recordedAt: string,
  assets: WorkAssetInput[] = [],
  kinds: ArtifactKind[] = [],
): ArtifactFile[] {
  const record = input as Record<string, unknown>;
  const files: ArtifactFile[] = [
    file('description.md', `${input.description}\n`),
    file('manifest.json', `${JSON.stringify(manifest(input, recordedAt, kinds), null, 2)}\n`),
  ];
  for (const kind of kinds) {
    const payload = record[kind.key];
    if (payload == null) continue;
    files.push(...kind.buildFiles(payload, { title: input.title, assets, input: record }));
  }
  for (const asset of assets) {
    files.push(file(`assets/${asset.filename}`, dataUri(asset), asset.mimeType));
  }
  files.push(...buildQuestionsFile(input));
  return files;
}

function manifest(input: SubmitWorkInput, recordedAt: string, kinds: ArtifactKind[]) {
  const present = new Set(artifactKindsPresent(input, kinds));
  return {
    title: input.title,
    recordedAt,
    sessionId: input.sessionId ?? null,
    turnId: input.turnId ?? null,
    kinds: Object.fromEntries(kinds.map((kind) => [kind.key, present.has(kind.key)])),
  };
}
