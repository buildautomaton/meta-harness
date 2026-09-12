import type { HarnessOptions } from '../../../types/harness/options.js';
import type { HarnessImplementation } from '../../../types/harness/implementation.js';
import { opencodeInstallDetectCommand, opencodeInstallTokenEnvVar, installOpencode } from './install.js';

export const opencodeHarnessOptions: HarnessOptions = {
  type: 'opencode',
  displayName: 'OpenCode',
  defaultCommand: [],
  authErrorHints: [],
  installDetectCommand: opencodeInstallDetectCommand,
  installTokenEnvVar: opencodeInstallTokenEnvVar,
};

export const opencodeHarnessImplementation: HarnessImplementation = {
  install: installOpencode,
  buildSpawnCommand: (base) => [...base],
};

export const opencodeHarness = { ...opencodeHarnessOptions, ...opencodeHarnessImplementation };
