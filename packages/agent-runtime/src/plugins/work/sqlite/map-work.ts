import type { WorkItem, WorkPriority, WorkStatus } from '@/types/work/records.js';
import { all } from './sql.js';
import type { Database } from 'node-sqlite3-wasm';

const STATUSES: WorkStatus[] = ['draft', 'held', 'in_progress', 'completed'];
const PRIOS: WorkPriority[] = ['high', 'medium', 'low'];

function asStatus(value: unknown): WorkStatus {
  return STATUSES.includes(value as WorkStatus) ? (value as WorkStatus) : 'draft';
}

function asPriority(value: unknown): WorkPriority {
  return PRIOS.includes(value as WorkPriority) ? (value as WorkPriority) : 'medium';
}

export function mapWorkRow(row: Record<string, unknown>, sessionIds: string[]): WorkItem {
  return {
    id: String(row.id),
    title: String(row.title),
    content: String(row.content ?? ''),
    status: asStatus(row.status),
    priority: asPriority(row.priority),
    queueRank: Number(row.queue_rank ?? 0),
    sessionIds,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    completedAt: row.completed_at == null ? null : String(row.completed_at),
  };
}

export function sessionIdsFor(db: Database, workId: string): string[] {
  return all(db, 'SELECT session_id FROM work_session WHERE work_id = ?', [workId]).map((r) =>
    String(r.session_id),
  );
}
