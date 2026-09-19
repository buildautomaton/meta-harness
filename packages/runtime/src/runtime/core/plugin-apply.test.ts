import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { cursorHarnessPlugin } from '@plugins/harnesses/cursor/plugin.js';
import { codexHarnessPlugin } from '@plugins/harnesses/codex/plugin.js';
import { diskSessionPlugin } from '@plugins/session/disk/plugin.js';
import { streamSessionPlugin } from '@plugins/session/stream/plugin.js';
import { httpTransportPlugin } from '@plugins/transport/http/plugin.js';
import { minionToolsPlugin } from '@plugins/tools/minion/plugin.js';
import { fileStorePlugin } from '@plugins/stores/file/plugin.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('plugin compose', () => {
  it('registers harnesses, wraps disk with stream, and sets HTTP transport', () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-plug-'));
    try {
      const slots = applyPlugins(
        [
          fileStorePlugin({ options: { root: dir } }),
          cursorHarnessPlugin(),
          diskSessionPlugin({ options: { dir } }),
          streamSessionPlugin(),
          httpTransportPlugin(),
          minionToolsPlugin(),
        ],
        { log: () => {}, cwd: '/tmp' },
      );
      expect(slots.harnesses.map((p) => p.type)).toContain('cursor-cli');
      expect(slots.backend?.id).toBe('disk');
      expect(slots.backendWraps).toHaveLength(1);
      expect(slots.transport?.id).toBe('http');
      expect(slots.tools).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('applies the same harness host implementation only once', () => {
    let writes = 0;
    const implementation = {
      writePersistedSession: () => {
        writes += 1;
      },
    };
    const slots = applyPlugins(
      [
        cursorHarnessPlugin({ implementation }),
        codexHarnessPlugin({ implementation }),
      ],
      { log: () => {}, cwd: '/tmp' },
    );
    slots.harnessHost?.writePersistedSession?.({
      scopeId: 's',
      acpSessionId: 'a',
      configOptions: null,
      modes: null,
    });
    expect(writes).toBe(1);
  });
});
