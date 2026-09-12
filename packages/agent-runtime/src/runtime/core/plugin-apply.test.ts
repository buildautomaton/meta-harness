import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { cursorHarnessPlugin } from '../../plugins/harnesses/cursor/plugin.js';
import { codexHarnessPlugin } from '../../plugins/harnesses/codex/plugin.js';
import { diskSessionPlugin } from '../../plugins/session/disk-plugin.js';
import { streamSessionPlugin } from '../../plugins/session/stream-plugin.js';
import { mcpTransportPlugin } from '../../plugins/transport/mcp/plugin.js';
import { subagentToolsPlugin } from '../../plugins/tools/plugin.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('plugin compose', () => {
  it('registers harnesses, wraps disk with stream, and sets MCP transport', () => {
    const dir = mkdtempSync(join(tmpdir(), 'harness-plug-'));
    try {
      const slots = applyPlugins(
        [
          cursorHarnessPlugin(),
          diskSessionPlugin({ options: { dir } }),
          streamSessionPlugin(),
          mcpTransportPlugin(),
          subagentToolsPlugin(),
        ],
        { log: () => {}, cwd: '/tmp' },
      );
      expect(slots.harnesses.map((p) => p.type)).toContain('cursor-cli');
      expect(slots.backend?.id).toBe('disk');
      expect(slots.backendWraps).toHaveLength(1);
      expect(slots.transport?.id).toBe('mcp');
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
