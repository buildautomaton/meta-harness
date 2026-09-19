import { randomUUID } from 'node:crypto';
import type { SqlStore } from '@buildautomaton/runtime';
import type { AddWorkInput, WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow, queueRank } from './rank.js';
import { getWorkRow } from './read-work.js';
import { replaceDecisions } from './decisions.js';
import { bottomRank } from './move-queue.js';

export function insertWork(db: SqlStore, input: AddWorkInput): WorkItem {
  const id = randomUUID();
  const now = isoNow();
  const priority = input.priority ?? 'medium';
  const queued = input.queued === true;
  const paused = input.paused === true;
  const status = queued ? 'queued' : 'draft';
  const rank = queued ? bottomRank(db) : queueRank(priority, false);
  try {
    run(
      db,
      `INSERT INTO work
       (id, title, content, status, priority, queue_rank, paused, prompt, agent_context, source_key, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.title,
        input.content ?? '',
        status,
        priority,
        rank,
        paused ? 1 : 0,
        input.prompt ?? '',
        input.agentContext ?? '',
        input.sourceKey ?? null,
        now,
        now,
      ],
    );
  } catch {
    run(
      db,
      `INSERT INTO work (id, title, content, status, priority, queue_rank, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.title, input.content ?? '', status, priority, rank, now, now],
    );
  }
  if (input.decisions?.length) replaceDecisions(db, id, input.decisions);
  return getWorkRow(db, id)!;
}
