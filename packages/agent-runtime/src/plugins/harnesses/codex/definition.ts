import type { HarnessOptions } from '../../../types/harness/options.js';
import type { HarnessImplementation } from '../../../types/harness/implementation.js';
import { applyCodexAfterSessionEstablished } from './after-session.js';
import { codexAuthErrorHints } from './auth.js';
import {
  buildCodexAcpSpawnCommand,
  createCodexAcpClient,
  DEFAULT_CODEX_ACP_COMMAND,
  detectLocalAgentPresence,
} from './client.js';
import { codexInstallDetectCommand, codexInstallTokenEnvVar, installCodex } from './install.js';

export const codexHarnessOptions: HarnessOptions = {
  type: 'codex-acp',
  displayName: 'Codex',
  defaultCommand: DEFAULT_CODEX_ACP_COMMAND,
  authErrorHints: codexAuthErrorHints,
  installDetectCommand: codexInstallDetectCommand,
  installTokenEnvVar: codexInstallTokenEnvVar,
};

export const codexHarnessImplementation: HarnessImplementation = {
  detectPresence: detectLocalAgentPresence,
  install: installCodex,
  createClient: (options) =>
    createCodexAcpClient({
      ...options,
      afterSessionEstablished: options.afterSessionEstablished ?? applyCodexAfterSessionEstablished,
    }),
  buildSpawnCommand: (base, sessionMode, agentConfig) =>
    buildCodexAcpSpawnCommand([...base], sessionMode, agentConfig),
};

export const codexHarness = { ...codexHarnessOptions, ...codexHarnessImplementation };
