import type { ArtifactFile } from '../work/artifact.js';
import type { WorkAssetInput } from '../work/events.js';

export type ArtifactBuildContext = {
  title: string;
  assets: WorkAssetInput[];
  input: Record<string, unknown>;
};

export type ArtifactKind = {
  key: string;
  title?: string;
  description: string;
  /** Extra agent-facing guidance composed into product-director tool instructions. */
  instructions?: string;
  schema: Record<string, unknown>;
  parse?: (value: unknown) => unknown;
  buildFiles: (payload: unknown, ctx: ArtifactBuildContext) => ArtifactFile[];
};
