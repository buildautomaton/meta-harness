import type { ChangeKind } from './change.js';

export type SummaryAreaInput = {
  area: string;
  description: string;
};

export type SummaryPathInput = {
  path: string;
  change: ChangeKind;
};

export type SummaryArtifactInput = {
  areas: SummaryAreaInput[];
  paths?: SummaryPathInput[];
};
