import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from './plugin.js';

describe('sql store migrations', () => {
  it('runs each plugin scope independently and skips applied names', () => {
    const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
    let a = 0;
    let b = 0;
    sql.migrate('plugin-a', [
      { name: '001', migrate: () => { a += 1; } },
      { name: '002', migrate: () => { a += 10; } },
    ]);
    sql.migrate('plugin-b', [{ name: '001', migrate: () => { b += 1; } }]);
    sql.migrate('plugin-a', [{ name: '001', migrate: () => { a += 100; } }]);
    expect(a).toBe(11);
    expect(b).toBe(1);
    const names = sql.all('SELECT scope, name FROM __migrations ORDER BY scope, name');
    expect(names).toEqual([
      { scope: 'plugin-a', name: '001' },
      { scope: 'plugin-a', name: '002' },
      { scope: 'plugin-b', name: '001' },
    ]);
  });
});
