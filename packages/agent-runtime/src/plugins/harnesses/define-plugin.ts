import type { HarnessPlugin, HarnessPluginInit } from '../../types/harness/plugin.js';
import type { HarnessOptions } from '../../types/harness/options.js';
import type { HarnessImplementation } from '../../types/harness/implementation.js';

export function defineHarnessPlugin(
  name: string,
  defaultOptions: HarnessOptions,
  defaultImplementation: HarnessImplementation,
) {
  return (init: HarnessPluginInit = {}): HarnessPlugin => ({
    name,
    kind: 'harness',
    options: { ...defaultOptions, ...init.options },
    hooks: init.hooks,
    implementation: { ...defaultImplementation, ...init.implementation },
    runtime: init.runtime,
  });
}
