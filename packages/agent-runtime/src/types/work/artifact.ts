import type { DesignQuestion } from './questions.js';

export const ARTIFACT_KIND_KEYS = [
  'ui',
  'api',
  'algorithm',
  'dataModel',
  'moduleStructure',
  'backend',
] as const;

export type ArtifactKindKey = (typeof ARTIFACT_KIND_KEYS)[number];

export type ArtifactFile = {
  path: string;
  content: string;
  contentType: string;
};

export type WorkArtifact = {
  id: string;
  workId: string | null;
  title: string;
  description: string;
  kinds: ArtifactKindKey[];
  sessionId: string | null;
  turnId: string | null;
  stream: string;
  files: ArtifactFile[];
  questions: Record<string, DesignQuestion[]>;
  createdAt: string;
};

export type WorkArtifactSummary = Omit<WorkArtifact, 'files' | 'questions'>;
