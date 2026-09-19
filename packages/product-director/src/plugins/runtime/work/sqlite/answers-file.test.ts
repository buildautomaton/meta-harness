import { describe, expect, it } from 'vitest';
import { QUESTIONS_FILE_PATH } from '@plugins/runtime/work/artifacts/questions-file.js';
import { memorySqlStore } from './backend.js';
import { WORK_MIGRATIONS } from './migrations.js';
import { run } from './sql.js';
import { saveAnswers } from './answers.js';

describe('saveAnswers from questions.json', () => {
  it('queues change answers even when artifact_question is empty', () => {
    const db = memorySqlStore();
    db.migrate('work-sqlite', WORK_MIGRATIONS);
    const id = 'art-1';
    run(
      db,
      `INSERT INTO artifact
       (id, work_id, title, description, kinds, session_id, turn_id, stream, created_at)
       VALUES (?, NULL, 'Checkout', 'desc', '[]', NULL, NULL, 'completed', 't')`,
      [id],
    );
    run(db, 'INSERT INTO artifact_file (artifact_id, path, content_type, content) VALUES (?, ?, ?, ?)', [
      id,
      QUESTIONS_FILE_PATH,
      'application/json',
      JSON.stringify({
        __overview__: [
          {
            id: 'q1',
            prompt: 'Keep this layout?',
            context: 'Edit checkout.html',
            choices: [
              { id: 'keep', label: 'Keep' },
              { id: 'change', label: 'Use a two-column layout' },
            ],
          },
        ],
      }),
    ]);
    const queued = saveAnswers(db, id, [{ subject: '__overview__', questionId: 'q1', choiceId: 'change' }]);
    expect(queued.queued).toHaveLength(1);
    expect(queued.queued[0]?.status).toBe('queued');
    expect(queued.queued[0]?.prompt).toBe('Keep this layout?');
    expect(queued.queued[0]?.decisions).toEqual(['Use a two-column layout']);
  });
});
