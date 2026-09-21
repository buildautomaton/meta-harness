import type { SqlStore } from '@buildautomaton/runtime';
import { DRAFT_ONLY } from '@/types/work/draft-only.js';
import type { WorkHub } from './hub.js';
import { getWorkRow } from './read-work.js';
import { deleteWorkRow } from './delete-row.js';

export function deleteDraft(db: SqlStore, hub: WorkHub, id: string): boolean {
  const item = getWorkRow(db, id);
  if (!item) return false;
  if (item.status !== 'draft') throw new Error(DRAFT_ONLY);
  hub.resolveAnswers(id, []);
  deleteWorkRow(db, id);
  return true;
}
