import { defineHarnessPlugin } from '../define-plugin.js';
import { codexHarnessOptions, codexHarnessImplementation } from './definition.js';

export const codexHarnessPlugin = defineHarnessPlugin(
  'harness-codex',
  codexHarnessOptions,
  codexHarnessImplementation,
);
