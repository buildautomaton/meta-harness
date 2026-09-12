import { defineHarnessPlugin } from '../define-plugin.js';
import { opencodeHarnessOptions, opencodeHarnessImplementation } from './definition.js';

export const opencodeHarnessPlugin = defineHarnessPlugin(
  'harness-opencode',
  opencodeHarnessOptions,
  opencodeHarnessImplementation,
);
