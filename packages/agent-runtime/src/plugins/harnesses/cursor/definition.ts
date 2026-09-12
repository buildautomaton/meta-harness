import type { HarnessOptions } from '../../../types/harness/options.js';
import type { HarnessImplementation } from '../../../types/harness/implementation.js';
import { cursorAuthErrorHints } from './auth.js';
import { cleanupSessionPlans } from './cleanup-session-plans.js';
import { createCursorAcpClient } from './cursor-acp-client.js';
import { detectLocalAgentPresence } from './cursor-local-agent.js';
import { buildCursorAcpSpawnCommand } from './cursor-spawn-command.js';
import {
  cursorInstallAlternateDetectCommands,
  cursorInstallDetectCommand,
  cursorInstallTokenEnvVar,
  installCursor,
} from './install.js';

export const cursorHarnessOptions: HarnessOptions = {
  type: 'cursor-cli',
  displayName: 'Cursor',
  defaultCommand: ['agent', 'acp'],
  authErrorHints: cursorAuthErrorHints,
  installDetectCommand: cursorInstallDetectCommand,
  installAlternateDetectCommands: cursorInstallAlternateDetectCommands,
  installTokenEnvVar: cursorInstallTokenEnvVar,
};

export const cursorHarnessImplementation: HarnessImplementation = {
  detectPresence: detectLocalAgentPresence,
  install: installCursor,
  createClient: createCursorAcpClient,
  buildSpawnCommand: (base, sessionMode) => buildCursorAcpSpawnCommand([...base], sessionMode),
  onPromptTurnFinished: cleanupSessionPlans,
  onSessionClosed: cleanupSessionPlans,
};

export const cursorHarness = { ...cursorHarnessOptions, ...cursorHarnessImplementation };
