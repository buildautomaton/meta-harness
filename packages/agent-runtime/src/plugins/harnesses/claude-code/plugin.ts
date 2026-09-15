import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { claudeCodeHarnessOptions, claudeCodeHarnessImplementation } from './definition.js';

export const claudeCodeHarnessPlugin = defineHarnessPlugin(
  'harness-claude-code',
  claudeCodeHarnessOptions,
  claudeCodeHarnessImplementation,
);
