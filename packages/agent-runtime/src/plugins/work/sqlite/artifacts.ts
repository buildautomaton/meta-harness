import type { Database } from 'node-sqlite3-wasm';
import type { DesignQuestion } from '@/types/work/questions.js';
import type { ArtifactFile, WorkArtifact, WorkArtifactSummary } from '@/types/work/artifact.js';
import { QUESTIONS_FILE_PATH, parseQuestionsFile } from '@plugins/work/artifacts/questions-file.js';
import { isPickedUp, sourceKeyFor, sourceStatus } from './source-key.js';
import { all } from './sql.js';
import { run } from './sql.js';

export function insertArtifactFiles(db: Database, artifactId: string, files: ArtifactFile[]): void {
  for (const file of files) {
    run(db, 'INSERT INTO artifact_file (artifact_id, path, content_type, content) VALUES (?, ?, ?, ?)', [
      artifactId,
      file.path,
      file.contentType,
      file.content,
    ]);
  }
}

export function insertQuestions(
  db: Database,
  artifactId: string,
  questions: Record<string, DesignQuestion[]>,
): void {
  for (const [subject, items] of Object.entries(questions)) {
    for (const q of items) {
      run(
        db,
        `INSERT INTO artifact_question
         (artifact_id, subject, question_id, prompt, context, choices, answer_id)
         VALUES (?, ?, ?, ?, ?, ?, NULL)`,
        [artifactId, subject, q.id, q.prompt, q.context, JSON.stringify(q.choices)],
      );
    }
  }
}

export function listArtifactSummaries(db: Database, workId?: string): WorkArtifactSummary[] {
  const rows = workId
    ? all(db, 'SELECT * FROM artifact WHERE work_id = ? ORDER BY created_at DESC', [workId])
    : all(db, 'SELECT * FROM artifact ORDER BY created_at DESC');
  return rows.map(mapSummary);
}

function mapSummary(row: Record<string, unknown>): WorkArtifactSummary {
  return {
    id: String(row.id),
    workId: row.work_id == null ? null : String(row.work_id),
    title: String(row.title),
    description: String(row.description),
    kinds: JSON.parse(String(row.kinds)) as WorkArtifactSummary['kinds'],
    sessionId: row.session_id == null ? null : String(row.session_id),
    turnId: row.turn_id == null ? null : String(row.turn_id),
    stream: String(row.stream),
    createdAt: String(row.created_at),
  };
}

export function loadArtifact(db: Database, id: string): WorkArtifact | null {
  const row = all(db, 'SELECT * FROM artifact WHERE id = ?', [id])[0];
  if (!row) return null;
  const files = all(db, 'SELECT * FROM artifact_file WHERE artifact_id = ?', [id]).map((f) => ({
    path: String(f.path),
    contentType: String(f.content_type),
    content: String(f.content),
  }));
  const grouped = groupQuestions(db, id, all(db, 'SELECT * FROM artifact_question WHERE artifact_id = ?', [id]));
  const file = files.find((entry) => entry.path === QUESTIONS_FILE_PATH);
  const questions = Object.keys(grouped).length ? grouped : parseQuestionsFile(file?.content ?? '');
  return { ...mapSummary(row), files, questions };
}

function groupQuestions(
  db: Database,
  artifactId: string,
  rows: Record<string, unknown>[],
): Record<string, DesignQuestion[]> {
  const out: Record<string, DesignQuestion[]> = {};
  for (const row of rows) {
    const subject = String(row.subject);
    const id = String(row.question_id);
    const list = out[subject] ?? [];
    list.push({
      id,
      prompt: String(row.prompt),
      context: String(row.context),
      choices: JSON.parse(String(row.choices)) as DesignQuestion['choices'],
      answerId: row.answer_id == null ? null : String(row.answer_id),
      locked: isPickedUp(sourceStatus(db, sourceKeyFor(artifactId, subject, id))),
    });
    out[subject] = list;
  }
  return out;
}
