import type { SqlStore } from '@buildautomaton/runtime';
import type { WorkItem, WorkPatch } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';
import { getWorkRow } from './read-work.js';
import { moveQueue } from './move-queue.js';

export function patchWork(db: SqlStore, id: string, patch: WorkPatch): WorkItem | null {
  const current = getWorkRow(db, id);
  if (!current) return null;
  if (patch.queue) moveQueue(db, id, patch.queue);
  const title = patch.title ?? current.title;
  const content = patch.content ?? current.content;
  const priority = patch.priority ?? current.priority;
  const paused = patch.paused ?? patch.held ?? current.paused;
  const status = patch.status ?? current.status;
  const prompt = patch.prompt ?? current.prompt;
  const agentContext = patch.agentContext ?? current.agentContext;
  const project = patch.project !== undefined ? patch.project.trim() : current.project;
  run(
    db,
    `UPDATE work SET title = ?, content = ?, status = ?, priority = ?, paused = ?, prompt = ?,
     agent_context = ?, project = ?, updated_at = ? WHERE id = ?`,
    [title, content, status, priority, paused ? 1 : 0, prompt, agentContext, project, isoNow(), id],
  );
  return getWorkRow(db, id);
}
