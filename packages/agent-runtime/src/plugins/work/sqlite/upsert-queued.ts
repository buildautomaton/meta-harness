import type { Database } from 'node-sqlite3-wasm';
import type { WorkItem } from '@/types/work/records.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';
import { getWorkRow } from './read-work.js';
import { insertWork } from './insert-work.js';
import { replaceDecisions } from './decisions.js';
import { ANSWER_LOCKED, findBySource, isPickedUp } from './source-key.js';

export function upsertQueuedWork(
  db: Database,
  input: {
    sourceKey: string;
    title: string;
    prompt: string;
    agentContext: string;
    content: string;
    decisions: string[];
  },
): WorkItem {
  const existing = findBySource(db, input.sourceKey);
  if (!existing) return insertWork(db, { ...input, queued: true });
  const current = getWorkRow(db, existing);
  if (current && isPickedUp(current.status)) throw new Error(ANSWER_LOCKED);
  run(
    db,
    `UPDATE work SET title = ?, content = ?, prompt = ?, agent_context = ?, status = 'queued',
     updated_at = ? WHERE id = ?`,
    [input.title, input.content, input.prompt, input.agentContext, isoNow(), existing],
  );
  replaceDecisions(db, existing, input.decisions);
  return getWorkRow(db, existing)!;
}
