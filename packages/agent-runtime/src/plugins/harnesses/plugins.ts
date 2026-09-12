import type { HarnessPluginInit } from '../../types/harness/plugin.js';
import { claudeCodeHarnessPlugin } from './claude-code/plugin.js';
import { codexHarnessPlugin } from './codex/plugin.js';
import { cursorHarnessPlugin } from './cursor/plugin.js';
import { kiroHarnessPlugin } from './kiro/plugin.js';
import { opencodeHarnessPlugin } from './opencode/plugin.js';

export {
  claudeCodeHarnessPlugin,
  codexHarnessPlugin,
  cursorHarnessPlugin,
  kiroHarnessPlugin,
  opencodeHarnessPlugin,
};

/** Built-in harness plugins in historical auto-detect order. */
export function coreHarnessPlugins(init: HarnessPluginInit = {}) {
  return [
    cursorHarnessPlugin(init),
    codexHarnessPlugin(init),
    kiroHarnessPlugin(init),
    claudeCodeHarnessPlugin(init),
    opencodeHarnessPlugin(init),
  ];
}
