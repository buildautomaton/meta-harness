import type { ArtifactKind } from '@/types/artifact/kind.js';
import type { ArtifactPlugin } from '@/types/artifact/plugin.js';
import { uiArtifactPlugin } from './ui.js';
import { apiArtifactPlugin } from './api.js';
import { algorithmArtifactPlugin } from './algorithm.js';
import { dataModelArtifactPlugin } from './data-model.js';
import { moduleStructureArtifactPlugin } from './module-structure.js';
import { backendArtifactPlugin } from './backend.js';
import { outlineArtifactPlugin } from './outline.js';

export function artifactPlugins(): ArtifactPlugin[] {
  return [
    uiArtifactPlugin(),
    apiArtifactPlugin(),
    algorithmArtifactPlugin(),
    dataModelArtifactPlugin(),
    moduleStructureArtifactPlugin(),
    backendArtifactPlugin(),
    outlineArtifactPlugin(),
  ];
}

export function builtinArtifactKinds(): ArtifactKind[] {
  return artifactPlugins().map((plugin) => plugin.artifact);
}
