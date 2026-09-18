import { randomUUID } from 'node:crypto';
import type { SqlStore } from '@buildautomaton/agent-runtime';
import type { WorkAssetInput } from '@/types/work/events.js';
import { all, run } from './sql.js';
import { isoNow } from './rank.js';

export function saveAssetRow(db: SqlStore, input: WorkAssetInput): WorkAssetInput {
  const id = randomUUID();
  run(
    db,
    `INSERT INTO work_asset (id, session_id, work_id, artifact_id, filename, mime_type, content, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.sessionId ?? null,
      input.workId ?? null,
      input.artifactId ?? null,
      input.filename,
      input.mimeType,
      input.base64,
      isoNow(),
    ],
  );
  return input;
}

export function listAssetRows(db: SqlStore, sessionId: string): WorkAssetInput[] {
  return all(db, 'SELECT * FROM work_asset WHERE session_id = ?', [sessionId]).map((row) => ({
    filename: String(row.filename),
    mimeType: String(row.mime_type),
    base64: String(row.content),
    sessionId: row.session_id == null ? undefined : String(row.session_id),
    workId: row.work_id == null ? undefined : String(row.work_id),
    artifactId: row.artifact_id == null ? undefined : String(row.artifact_id),
  }));
}
