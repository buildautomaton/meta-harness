import type { SqlStore } from '@buildautomaton/runtime';

export type SqlBind = string | number | null;

export function all(db: SqlStore, sql: string, params: SqlBind[] = []): Record<string, unknown>[] {
  const rows = (params.length ? db.all(sql, params) : db.all(sql)) as Record<string, unknown>[] | undefined;
  return rows ?? [];
}

export function one(db: SqlStore, sql: string, params: SqlBind[] = []): Record<string, unknown> | undefined {
  const row = (params.length ? db.get(sql, params) : db.get(sql)) as Record<string, unknown> | null | undefined;
  return row ?? undefined;
}

export function run(db: SqlStore, sql: string, params: SqlBind[] = []): void {
  if (params.length) db.run(sql, params);
  else db.run(sql);
}
