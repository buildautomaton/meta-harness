export const WORK_STATUSES = ['draft', 'held', 'in_progress', 'completed'] as const;
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
  sessionIds: string[];
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
};

export type WorkPatch = {
  title?: string;
  content?: string;
  status?: WorkStatus;
  priority?: WorkPriority;
  held?: boolean;
};
