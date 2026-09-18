import type { ArtifactPlugin, ArtifactKind } from '@/types/artifact/index.js';

export function artifactPlugin(name: string, artifact: ArtifactKind): ArtifactPlugin {
  return { name, kind: 'artifact', artifact };
}
