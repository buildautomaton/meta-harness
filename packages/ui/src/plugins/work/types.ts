export type WorkStatus = 'draft' | 'queued' | 'held' | 'in_progress' | 'completed';
export type WorkPriority = 'high' | 'medium' | 'low';

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
  decisions: string[];
  questions: DesignQuestion[];
  sessionIds: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type DesignChoice = { id: string; label: string };
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
};

export type WorkClient = {
  listWork(): Promise<WorkItem[]>;
  addWork(input: { title: string; content?: string; held?: boolean }): Promise<WorkItem>;
  updateWork(id: string, patch: WorkPatch): Promise<WorkItem | null>;
  listArtifacts(workId?: string): Promise<ArtifactSummary[]>;
  getArtifact(id: string): Promise<WorkArtifact | null>;
  answerQuestions(
    artifactId: string,
    answers: { subject: string; questionId: string; choiceId: string }[],
  ): Promise<AnswerQuestionsResult>;
  answerWorkQuestions(
    workId: string,
    answers: { subject: string; questionId: string; choiceId: string }[],
  ): Promise<WorkItem | null>;
};
