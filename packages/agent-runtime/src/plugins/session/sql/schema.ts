export const SESSION_SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS harness_session (
  id TEXT PRIMARY KEY,
  json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS harness_session_event (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  json TEXT NOT NULL,
  PRIMARY KEY (session_id, seq)
);
`;
