import type { ChangeKind } from './change.js';

export type ChangesOverviewPathInput = {
  path: string;
  change: ChangeKind;
};

export type ChangesOverviewGroupInput = {
  description: string;
  paths: ChangesOverviewPathInput[];
};

export type ChangesOverviewArtifactInput = {
  groups: ChangesOverviewGroupInput[];
};
