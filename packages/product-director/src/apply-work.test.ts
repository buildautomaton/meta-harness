import { describe, expect, it } from 'vitest';
import {
  applyPlugins,
  diskSessionPlugin,
  httpTransportPlugin,
  fileStorePlugin,
  sqlStorePlugin,
} from '@buildautomaton/runtime';
import { memoryWorkPlugin } from './plugins/runtime/work/sqlite/plugin.js';
import { workToolsPlugin } from './plugins/runtime/work-tools/plugin.js';
import { artifactPlugins } from './plugins/runtime/artifacts/builtins.js';
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
