export const WORK_SCHEMA = `
CREATE TABLE IF NOT EXISTS work (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  queue_rank INTEGER NOT NULL DEFAULT 0,
  paused INTEGER NOT NULL DEFAULT 0,
  prompt TEXT NOT NULL DEFAULT '',
  agent_context TEXT NOT NULL DEFAULT '',
  source_key TEXT,
  project TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);
CREATE TABLE IF NOT EXISTS work_session (
  session_id TEXT NOT NULL,
  work_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  artifact_id TEXT,
  PRIMARY KEY (session_id, work_id)
);
CREATE TABLE IF NOT EXISTS artifact (
  id TEXT PRIMARY KEY,
  work_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project TEXT NOT NULL DEFAULT '',
  kinds TEXT NOT NULL,
  session_id TEXT,
  turn_id TEXT,
  stream TEXT NOT NULL DEFAULT 'completed',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS artifact_file (
  artifact_id TEXT NOT NULL,
  path TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (artifact_id, path)
);
CREATE TABLE IF NOT EXISTS artifact_question (
  artifact_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  question_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  context TEXT NOT NULL,
  choices TEXT NOT NULL,
  answer_id TEXT,
  PRIMARY KEY (artifact_id, subject, question_id)
);
CREATE TABLE IF NOT EXISTS work_question (
  work_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  context TEXT NOT NULL,
  choices TEXT NOT NULL,
  answer_id TEXT,
  PRIMARY KEY (work_id, question_id)
);
CREATE TABLE IF NOT EXISTS work_decision (
  work_id TEXT NOT NULL,
  ordinal INTEGER NOT NULL,
  text TEXT NOT NULL,
  PRIMARY KEY (work_id, ordinal)
);
CREATE TABLE IF NOT EXISTS work_asset (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  work_id TEXT,
  artifact_id TEXT,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;
