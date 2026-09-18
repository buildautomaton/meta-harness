import { describe, expect, it } from 'vitest';
import {
  applyPlugins,
  diskSessionPlugin,
  httpTransportPlugin,
  fileStorePlugin,
  sqlStorePlugin,
} from '@buildautomaton/agent-runtime';
import { memoryWorkPlugin } from './plugins/work/sqlite/plugin.js';
import { workToolsPlugin } from './plugins/work-tools/plugin.js';
import { artifactPlugins } from './plugins/artifacts/builtins.js';
import type { WorkImplementation } from './types/work/implementation.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('work plugin compose', () => {
  it('discovers artifact plugins and fills extras.work', () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-work-'));
    try {
      const slots = applyPlugins(
        [
          fileStorePlugin({ options: { root: dir } }),
          sqlStorePlugin({ options: { file: ':memory:' } }),
          diskSessionPlugin({ options: { dir } }),
          ...artifactPlugins(),
          memoryWorkPlugin(),
          workToolsPlugin(),
          httpTransportPlugin(),
        ],
        { log: () => {}, cwd: '/tmp' },
      );
      const work = slots.extras.work as WorkImplementation & { id?: string };
      expect(work?.id).toBe('memory');
      expect((slots.extras['work-memory'] as { id?: string })?.id).toBe('memory');
      expect(slots.byKind.get('artifact')).toHaveLength(7);
      expect(slots.extras.artifacts).toHaveLength(7);
      expect(slots.tools).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
