export type WorkStatus = 'draft' | 'queued' | 'held' | 'in_progress' | 'completed';
export type WorkPriority = 'high' | 'medium' | 'low';
export type WorkOrigin =
  | { kind: 'question'; artifactId: string; subject: string; questionId: string }
  | { kind: 'draft'; workId: string };

export type WorkItem = {
  id: string;
  title: string;
  content: string;
  status: WorkStatus;
  priority: WorkPriority;
  queueRank: number;
  paused: boolean;
  prompt: string;
  agentContext: string;
  origin: WorkOrigin;
  decisions: string[];
  questions: DesignQuestion[];
  sessionIds: string[];
  project: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ChoiceKind = 'status_quo' | 'change';
export type DesignChoice = {
  id: string;
  label: string;
  kind?: ChoiceKind;
  prompt?: string;
  context?: string;
};
export type DesignQuestion = {
  id: string;
  prompt: string;
  context: string;
  choices: DesignChoice[];
  answerId?: string | null;
  locked?: boolean;
};

export type ArtifactFile = { path: string; content: string; contentType: string };

export type WorkArtifact = {
  id: string;
  workId: string | null;
  title: string;
  description: string;
  kinds: string[];
  sessionId: string | null;
  files: ArtifactFile[];
  questions: Record<string, DesignQuestion[]>;
  project?: string;
  createdAt: string;
};

export type ArtifactSummary = {
  id: string;
  workId?: string | null;
  title?: string;
  description?: string;
  createdAt?: string;
  sessionId?: string | null;
};

export type AnswerQuestionsResult = {
  queued: WorkItem[];
  removed: string[];
};

export type WorkPatch = {
  held?: boolean;
  paused?: boolean;
  status?: WorkStatus;
  queue?: 'top' | 'bottom';
  unqueue?: boolean;
  project?: string;
};

export type WorkClient = {
  listWork(): Promise<WorkItem[]>;
  addWork(input: { title: string; content?: string; held?: boolean; project?: string }): Promise<WorkItem>;
  updateWork(id: string, patch: WorkPatch): Promise<WorkItem | null>;
  renameProject(from: string, to: string): Promise<void>;
  deleteWork(id: string): Promise<void>;
  listArtifacts(workId?: string): Promise<ArtifactSummary[]>;
  getArtifact(id: string): Promise<WorkArtifact | null>;
  updateArtifact(id: string, patch: { project: string }): Promise<WorkArtifact | null>;
  answerQuestions(
    artifactId: string,
    answers: { subject: string; questionId: string; choiceId: string }[],
  ): Promise<AnswerQuestionsResult>;
  answerWorkQuestions(workId: string, answers: { subject: string; questionId: string; choiceId: string }[]): Promise<WorkItem | null>;
};
