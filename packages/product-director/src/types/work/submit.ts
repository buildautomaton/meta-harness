import type { ReviewQuestions } from './questions.js';
import type { WorkAssetInput } from './events.js';
import type { ChangeKind } from './change.js';
import type { SummaryArtifactInput } from './summary.js';
import type { DataModelInput } from './data-model.js';

export type UiBannerInput = {
  change: ChangeKind;
  text: string;
};

export type UiPageInput = {
  filename: string;
  title: string;
  html: string;
  banner: UiBannerInput;
};

export type ApiRouteInput = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'WEBSOCKET';
  path: string;
  change: ChangeKind;
  description: string;
};

export type SubmitWorkInput = {
  title: string;
  description: string;
  project?: string;
  sessionId?: string;
  turnId?: string;
  ui?: { pages: UiPageInput[] };
  api?: { routes: ApiRouteInput[] };
  algorithm?: { name: string; whatChanged: string; pseudocode: string };
  dataModel?: DataModelInput;
  summary?: SummaryArtifactInput;
  assets?: WorkAssetInput[];
  questions?: ReviewQuestions;
};
