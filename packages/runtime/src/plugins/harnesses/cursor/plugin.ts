import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { cursorHarnessOptions, cursorHarnessImplementation } from './definition.js';

export const cursorHarnessPlugin = defineHarnessPlugin(
  'harness-cursor',
  cursorHarnessOptions,
  cursorHarnessImplementation,
);
