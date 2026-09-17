import { randomUUID } from 'node:crypto';
import type { Database } from 'node-sqlite3-wasm';
import type { SubmitWorkInput } from '@/types/work/submit.js';
import type { WorkArtifact } from '@/types/work/artifact.js';
import { run } from './sql.js';
import { isoNow } from './rank.js';
import { one } from './sql.js';
import { insertArtifactFiles, insertQuestions, loadArtifact } from './artifacts.js';
import { completeSessionRow } from './sessions.js';
import { buildArtifactFiles } from '@plugins/work/artifacts/build-files.js';
import { artifactKindsPresent } from '@plugins/work/artifacts/kinds.js';
import { questionsBySubject } from '@plugins/work/artifacts/questions-file.js';
import { mergeAssets } from '@plugins/work/artifacts/embed-assets.js';
import { listAssetRows } from './assets.js';

export function recordSubmission(db: Database, input: SubmitWorkInput): WorkArtifact {
  const id = randomUUID();
  const createdAt = isoNow();
  const assets = mergeAssets(input.sessionId ? listAssetRows(db, input.sessionId) : [], input.assets ?? []);
  const files = buildArtifactFiles(input, createdAt, assets);
  const workId = workIdForSession(db, input.sessionId);
  run(
    db,
    `INSERT INTO artifact
     (id, work_id, title, description, kinds, session_id, turn_id, stream, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)`,
    [
      id,
      workId,
      input.title,
      input.description,
      JSON.stringify(artifactKindsPresent(input)),
      input.sessionId ?? null,
      input.turnId ?? null,
      createdAt,
    ],
  );
  insertArtifactFiles(db, id, files);
  insertQuestions(db, id, questionsBySubject(input));
  if (input.sessionId) completeSessionRow(db, input.sessionId, id);
  return loadArtifact(db, id)!;
}

function workIdForSession(db: Database, sessionId?: string): string | null {
  if (!sessionId) return null;
  const row = one(db, 'SELECT work_id FROM work_session WHERE session_id = ?', [sessionId]);
  return row ? String(row.work_id) : null;
}
