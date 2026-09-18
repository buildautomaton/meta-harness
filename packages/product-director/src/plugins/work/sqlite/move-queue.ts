import type { SqlStore } from '@buildautomaton/agent-runtime';
import { all } from './sql.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';

export function extremaRanks(db: SqlStore): { max: number; min: number } {
  const row = all(db, "SELECT MAX(queue_rank) AS max_rank, MIN(queue_rank) AS min_rank FROM work WHERE status = 'queued'")[0];
  return { max: Number(row?.max_rank ?? 0), min: Number(row?.min_rank ?? 0) };
}

export function bottomRank(db: SqlStore): number {
  return extremaRanks(db).min - 1;
}

export function moveQueue(db: SqlStore, id: string, edge: 'top' | 'bottom'): void {
  const { max, min } = extremaRanks(db);
  const rank = edge === 'top' ? max + 1 : min - 1;
  run(db, 'UPDATE work SET queue_rank = ?, updated_at = ? WHERE id = ?', [rank, isoNow(), id]);
}
