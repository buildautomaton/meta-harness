import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { memoryWorkPlugin } from '@plugins/work/sqlite/plugin.js';
import { workToolsPlugin } from '@plugins/work-tools/plugin.js';
import { mcpTransportPlugin } from '@plugins/transport/mcp/plugin.js';
import { diskSessionPlugin } from '@plugins/session/disk/plugin.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('work plugin compose', () => {
  it('fills the work slot and registers work tools', () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-work-'));
    try {
      const slots = applyPlugins(
        [
          diskSessionPlugin({ options: { dir } }),
          memoryWorkPlugin(),
          workToolsPlugin(),
          mcpTransportPlugin(),
        ],
        { log: () => {}, cwd: '/tmp' },
      );
      expect(slots.work?.id).toBe('memory');
      expect(slots.tools).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
