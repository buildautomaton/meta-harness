import { randomUUID } from 'node:crypto';
import type { Database } from 'node-sqlite3-wasm';
import type { AddWorkInput, WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow, queueRank } from './rank.js';
import { getWorkRow } from './read-work.js';

export function insertWork(db: Database, input: AddWorkInput): WorkItem {
  const id = randomUUID();
  const now = isoNow();
  const priority = input.priority ?? 'medium';
  const held = input.held === true;
  run(
    db,
    `INSERT INTO work (id, title, content, status, priority, queue_rank, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.content ?? '',
      held ? 'held' : 'draft',
      priority,
      queueRank(priority, held),
      now,
      now,
    ],
  );
  return getWorkRow(db, id)!;
}
