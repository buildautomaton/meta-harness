import type { AgentProvider } from '../types.js';
import { kiroAuthErrorHints } from './auth.js';
import {
  buildKiroAcpSpawnCommand,
  createKiroAcpClient,
  DEFAULT_KIRO_ACP_COMMAND,
  detectLocalAgentPresence,
} from './client.js';
import { createKiroSdkExtNotificationHandler } from './ext-notifications.js';

export const kiroProvider: AgentProvider = {
  type: 'kiro-acp',
  displayName: 'Kiro',
  defaultCommand: DEFAULT_KIRO_ACP_COMMAND,
  authErrorHints: kiroAuthErrorHints,
  detectPresence: detectLocalAgentPresence,
  createClient: (options) =>
    createKiroAcpClient({
      ...options,
      createExtNotificationHandler:
        options.createExtNotificationHandler ?? createKiroSdkExtNotificationHandler,
    }),
  buildSpawnCommand: (base, sessionMode) => buildKiroAcpSpawnCommand([...base], sessionMode),
};
