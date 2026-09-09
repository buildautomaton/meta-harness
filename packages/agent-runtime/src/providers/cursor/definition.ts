import type { AgentProvider } from '../types.js';
import { cursorAuthErrorHints } from './auth.js';
import { cleanupSessionPlans } from './cleanup-session-plans.js';
import { createCursorAcpClient } from './cursor-acp-client.js';
import { detectLocalAgentPresence } from './cursor-local-agent.js';
import { buildCursorAcpSpawnCommand } from './cursor-spawn-command.js';
import { cursorInstall } from './install.js';

export const cursorProvider: AgentProvider = {
  type: 'cursor-cli',
  displayName: 'Cursor',
  defaultCommand: ['agent', 'acp'],
  authErrorHints: cursorAuthErrorHints,
  detectPresence: detectLocalAgentPresence,
  install: cursorInstall,
  createClient: createCursorAcpClient,
  buildSpawnCommand: (base, sessionMode) => buildCursorAcpSpawnCommand([...base], sessionMode),
  onPromptTurnFinished: cleanupSessionPlans,
  onSessionClosed: cleanupSessionPlans,
};
