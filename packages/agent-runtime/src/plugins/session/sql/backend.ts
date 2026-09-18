import type { SqlStore } from '@/types/sql-store/implementation.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { SessionEvent, SessionRecord } from '@/types/session/records.js';
import type { SessionCompactPayload } from '@/types/session/log.js';
import { SESSION_MIGRATIONS } from './migrations.js';

export function createSqlSessionBackend(sql: SqlStore): SessionImplementation {
  sql.migrate('session-disk', SESSION_MIGRATIONS);
  return {
    create(record) {
      upsertRecord(sql, record);
    },
    append(sessionId, event) {
      const seq = nextSeq(sql, sessionId);
      sql.run('INSERT INTO harness_session_event (session_id, seq, json) VALUES (?, ?, ?)', [
        sessionId,
        seq,
        JSON.stringify(event),
      ]);
    },
    patch(sessionId, patch) {
      const prev = loadRecord(sql, sessionId);
      if (!prev) return;
      upsertRecord(sql, { ...prev, ...patch, updatedAt: new Date().toISOString() });
    },
    get(sessionId) {
      const session = loadRecord(sql, sessionId);
      if (!session) return null;
      return { session, events: loadEvents(sql, sessionId) };
    },
    list() {
      return sql.all('SELECT json FROM harness_session ORDER BY updated_at').map(parseRecord);
    },
    compact(sessionId, payload: SessionCompactPayload) {
      const prev = loadRecord(sql, sessionId);
      if (!prev) return;
      upsertRecord(sql, { ...prev, transcript: payload.transcript, log: payload.log });
      sql.run('DELETE FROM harness_session_event WHERE session_id = ?', [sessionId]);
    },
  };
}

function upsertRecord(sql: SqlStore, record: SessionRecord): void {
  sql.run('INSERT OR REPLACE INTO harness_session (id, json, updated_at) VALUES (?, ?, ?)', [
    record.id,
    JSON.stringify(record),
    record.updatedAt,
  ]);
}

function loadRecord(sql: SqlStore, id: string): SessionRecord | null {
  const row = sql.get('SELECT json FROM harness_session WHERE id = ?', [id]);
  return row ? parseRecord(row) : null;
}

function parseRecord(row: Record<string, unknown>): SessionRecord {
  return JSON.parse(String(row.json)) as SessionRecord;
}

function loadEvents(sql: SqlStore, sessionId: string): SessionEvent[] {
  return sql
    .all('SELECT json FROM harness_session_event WHERE session_id = ? ORDER BY seq', [sessionId])
    .map((row) => JSON.parse(String(row.json)) as SessionEvent);
}

function nextSeq(sql: SqlStore, sessionId: string): number {
  const row = sql.get('SELECT COALESCE(MAX(seq), 0) AS n FROM harness_session_event WHERE session_id = ?', [
    sessionId,
  ]);
  return Number(row?.n ?? 0) + 1;
}
