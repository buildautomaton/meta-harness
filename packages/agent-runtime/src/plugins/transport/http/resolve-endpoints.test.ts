import { describe, expect, it } from 'vitest';
import { resolveHttpEndpoints } from './resolve-endpoints.js';
import { createSqliteWorkBackend } from '@plugins/work/sqlite/backend.js';
import type { CommandHost } from '@/types/transport/implementation.js';

function hostWithWork(name: string): CommandHost {
  return {
    cwd: '/tmp',
    listTools: async () => [],
    callTool: async () => ({ content: [] }),
    plugins: { work: { [name]: createSqliteWorkBackend(':memory:') } },
  };
}

describe('resolveHttpEndpoints', () => {
  it('defaults tools to /mcp and expands a work root', () => {
    const resolved = resolveHttpEndpoints(
      { endpoints: [{ kind: 'work', path: '/api', plugin: 'work-sqlite' }] },
      hostWithWork('work-sqlite'),
    );
    expect(resolved.map((e) => [e.kind, e.path, e.surface])).toEqual([
      ['tools', '/mcp', undefined],
      ['work', '/api/work', undefined],
      ['work', '/api/artifacts', 'artifacts'],
    ]);
    expect(resolved[1]?.work).toBeDefined();
  });

  it('leaves work undefined when the plugin name is missing', () => {
    const resolved = resolveHttpEndpoints(
      { endpoints: [{ kind: 'work', path: '/api', plugin: 'missing' }] },
      hostWithWork('work-sqlite'),
    );
    expect(resolved.find((e) => e.kind === 'work')?.work).toBeUndefined();
  });
});
