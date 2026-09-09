import type { AgentProvider } from '../types.js';
import { applyCodexAfterSessionEstablished } from './after-session.js';
import { codexAuthErrorHints } from './auth.js';
import {
  buildCodexAcpSpawnCommand,
  createCodexAcpClient,
  DEFAULT_CODEX_ACP_COMMAND,
  detectLocalAgentPresence,
} from './client.js';
import { codexInstall } from './install.js';

export const codexProvider: AgentProvider = {
  type: 'codex-acp',
  displayName: 'Codex',
  defaultCommand: DEFAULT_CODEX_ACP_COMMAND,
  authErrorHints: codexAuthErrorHints,
  detectPresence: detectLocalAgentPresence,
  install: codexInstall,
  createClient: (options) =>
    createCodexAcpClient({
      ...options,
      afterSessionEstablished: options.afterSessionEstablished ?? applyCodexAfterSessionEstablished,
    }),
  buildSpawnCommand: (base, sessionMode, agentConfig) =>
    buildCodexAcpSpawnCommand([...base], sessionMode, agentConfig),
};
