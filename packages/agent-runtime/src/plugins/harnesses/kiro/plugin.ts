import { defineHarnessPlugin } from '../define-plugin.js';
import { kiroHarnessOptions, kiroHarnessImplementation } from './definition.js';

export const kiroHarnessPlugin = defineHarnessPlugin(
  'harness-kiro',
  kiroHarnessOptions,
  kiroHarnessImplementation,
);
