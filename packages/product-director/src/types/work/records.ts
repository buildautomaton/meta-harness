import type { DesignQuestion } from './questions.js';
import type { WorkOrigin } from './origin.js';

export const WORK_STATUSES = ['draft', 'queued', 'held', 'in_progress', 'completed'] as const;
export type WorkStatus = (typeof WORK_STATUSES)[number];

export const WORK_PRIORITIES = ['high', 'medium', 'low'] as const;
export type WorkPriority = (typeof WORK_PRIORITIES)[number];

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

export type WorkSessionLink = {
  sessionId: string;
  workId: string;
  status: 'picked_up' | 'completed';
  createdAt: string;
  completedAt: string | null;
  artifactId: string | null;
};

export type AddWorkInput = {
  title: string;
  content?: string;
  priority?: WorkPriority;
  held?: boolean;
  queued?: boolean;
  paused?: boolean;
  prompt?: string;
  agentContext?: string;
  decisions?: string[];
  sourceKey?: string;
  project?: string;
};

export type WorkPatch = {
  title?: string;
  content?: string;
  status?: WorkStatus;
  priority?: WorkPriority;
  held?: boolean;
  paused?: boolean;
  queue?: 'top' | 'bottom';
  prompt?: string;
  agentContext?: string;
  unqueue?: boolean;
};
