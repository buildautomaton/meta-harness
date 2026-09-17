export type WorkEventType = 'work.changed' | 'artifact.changed' | 'answers.changed';

export type WorkEvent = {
  type: WorkEventType;
  id?: string;
  at: string;
};

export type WorkListener = (event: WorkEvent) => void;

export type WorkAssetInput = {
  filename: string;
  mimeType: string;
  base64: string;
  sessionId?: string;
  workId?: string;
  artifactId?: string;
};
