import type { Database } from 'node-sqlite3-wasm';

export type SqlBind = string | number | null;

export function all(db: Database, sql: string, params: SqlBind[] = []): Record<string, unknown>[] {
  const rows = (params.length ? db.all(sql, params) : db.all(sql)) as Record<string, unknown>[] | undefined;
  return rows ?? [];
}

export function one(db: Database, sql: string, params: SqlBind[] = []): Record<string, unknown> | undefined {
  const row = (params.length ? db.get(sql, params) : db.get(sql)) as Record<string, unknown> | null | undefined;
  return row ?? undefined;
}

export function run(db: Database, sql: string, params: SqlBind[] = []): void {
  if (params.length) db.run(sql, params);
  else db.run(sql);
}
