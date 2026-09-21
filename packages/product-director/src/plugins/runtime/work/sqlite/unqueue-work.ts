import type { SqlStore } from '@buildautomaton/runtime';
import type { WorkItem } from '@/types/work/records.js';
import { getWorkRow } from './read-work.js';
import { clearAnswer } from './clear-answer.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';

export function unqueueWork(db: SqlStore, id: string): WorkItem | null {
  const item = getWorkRow(db, id);
  if (!item || item.status !== 'queued') return item;
  if (item.origin.kind === 'question') {
    clearAnswer(db, item.origin.artifactId, {
      subject: item.origin.subject,
      questionId: item.origin.questionId,
      choiceId: '',
    });
    return getWorkRow(db, id);
  }
  run(db, "UPDATE work SET status = 'draft', updated_at = ? WHERE id = ?", [isoNow(), id]);
  return getWorkRow(db, id);
}
