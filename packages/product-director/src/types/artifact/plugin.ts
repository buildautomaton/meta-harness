import type { PluginRuntimeContext } from '@buildautomaton/agent-runtime';
import type { ArtifactKind } from './kind.js';

export type ArtifactPlugin = {
  name: string;
  kind: 'artifact';
  artifact: ArtifactKind;
  runtime?: PluginRuntimeContext;
};
