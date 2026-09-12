import type { HarnessOptions } from '../../../types/harness/options.js';
import type { HarnessImplementation } from '../../../types/harness/implementation.js';
import { kiroAuthErrorHints } from './auth.js';
import {
  buildKiroAcpSpawnCommand,
  createKiroAcpClient,
  DEFAULT_KIRO_ACP_COMMAND,
  detectLocalAgentPresence,
} from './client.js';
import { createKiroSdkExtNotificationHandler } from './ext-notifications.js';

export const kiroHarnessOptions: HarnessOptions = {
  type: 'kiro-acp',
  displayName: 'Kiro',
  defaultCommand: DEFAULT_KIRO_ACP_COMMAND,
  authErrorHints: kiroAuthErrorHints,
};

export const kiroHarnessImplementation: HarnessImplementation = {
  detectPresence: detectLocalAgentPresence,
  createClient: (options) =>
    createKiroAcpClient({
      ...options,
      createExtNotificationHandler:
        options.createExtNotificationHandler ?? createKiroSdkExtNotificationHandler,
    }),
  buildSpawnCommand: (base, sessionMode) => buildKiroAcpSpawnCommand([...base], sessionMode),
};

export const kiroHarness = { ...kiroHarnessOptions, ...kiroHarnessImplementation };
