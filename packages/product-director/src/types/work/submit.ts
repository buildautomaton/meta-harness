import type { ReviewQuestions } from './questions.js';
import type { OutlineArtifactInput } from './outline.js';
import type { WorkAssetInput } from './events.js';

export type UiPageInput = {
  filename: string;
  title: string;
  html: string;
  whatChanged?: string;
};

export type ApiRouteInput = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'WEBSOCKET';
  path: string;
  change: 'added' | 'modified' | 'removed';
  description: string;
};

export type SubmitWorkInput = {
  title: string;
  description: string;
  sessionId?: string;
  turnId?: string;
  ui?: { pages: UiPageInput[] };
  api?: { routes: ApiRouteInput[] };
  algorithm?: { name: string; whatChanged: string; pseudocode: string };
  dataModel?: { mermaid: string; whatChanged: string };
  moduleStructure?: { mermaid: string; whatChanged: string };
  backend?: { description: string };
  outline?: OutlineArtifactInput;
  assets?: WorkAssetInput[];
  questions?: ReviewQuestions;
};
