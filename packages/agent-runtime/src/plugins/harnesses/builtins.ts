import { claudeCodeHarness } from './claude-code/definition.js';
import { codexHarness } from './codex/definition.js';
import { cursorHarness } from './cursor/definition.js';
import { kiroHarness } from './kiro/definition.js';
import { opencodeHarness } from './opencode/definition.js';
import type { AgentHarness } from '../../runtime/harnesses/types.js';

export const BUILTIN_HARNESSES: readonly AgentHarness[] = [
  cursorHarness,
  codexHarness,
  kiroHarness,
  claudeCodeHarness,
  opencodeHarness,
];
