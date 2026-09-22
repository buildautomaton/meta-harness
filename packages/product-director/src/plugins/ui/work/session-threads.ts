import type { WorkArtifact } from './types.js';

export type SessionThread = {
  key: string;
  sessionId: string | null;
  /** Oldest → newest. Latest is the visible post when collapsed. */
  artifacts: WorkArtifact[];
};

export function sessionThreads(artifacts: WorkArtifact[]): SessionThread[] {
  const grouped = new Map<string, WorkArtifact[]>();
  const threads: SessionThread[] = [];
  for (const artifact of artifacts) {
    const sessionId = artifact.sessionId?.trim() || null;
    if (!sessionId) {
      threads.push({ key: `artifact:${artifact.id}`, sessionId: null, artifacts: [artifact] });
      continue;
    }
    const list = grouped.get(sessionId) ?? [];
    list.push(artifact);
    grouped.set(sessionId, list);
  }
  for (const [sessionId, list] of grouped) {
    threads.push({ key: `session:${sessionId}`, sessionId, artifacts: sortOldestFirst(list) });
  }
  return threads.sort((a, b) => compareNewestFirst(latestOf(a), latestOf(b)));
}

function sortOldestFirst(list: WorkArtifact[]): WorkArtifact[] {
  return [...list].sort(compareOldestFirst);
}

function latestOf(thread: SessionThread): WorkArtifact {
  return thread.artifacts[thread.artifacts.length - 1]!;
}

function compareOldestFirst(a: WorkArtifact, b: WorkArtifact): number {
  return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
}

function compareNewestFirst(a: WorkArtifact, b: WorkArtifact): number {
  return b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id);
}
