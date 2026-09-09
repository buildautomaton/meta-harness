import type { AgentProvider } from '../types.js';
import { applyClaudeCodeAfterSessionEstablished } from './after-session.js';
import { claudeCodeAuthErrorHints } from './auth.js';
import {
  buildClaudeCodeAcpSpawnCommand,
  createClaudeCodeAcpClient,
  detectLocalAgentPresence,
} from './client.js';
import { claudeCodeInstall } from './install.js';

const DEFAULT_COMMAND = ['npx', '--yes', '@agentclientprotocol/claude-agent-acp'] as const;

export const claudeCodeProvider: AgentProvider = {
  type: 'claude-code',
  displayName: 'Claude Code',
  defaultCommand: DEFAULT_COMMAND,
  authErrorHints: claudeCodeAuthErrorHints,
  detectPresence: detectLocalAgentPresence,
  install: claudeCodeInstall,
  createClient: (options) =>
    createClaudeCodeAcpClient({
      ...options,
      afterSessionEstablished: options.afterSessionEstablished ?? applyClaudeCodeAfterSessionEstablished,
    }),
  buildSpawnCommand: (base, sessionMode) => buildClaudeCodeAcpSpawnCommand([...base], sessionMode),
};
