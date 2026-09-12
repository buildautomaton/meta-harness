import type { HarnessOptions } from '../../../types/harness/options.js';
import type { HarnessImplementation } from '../../../types/harness/implementation.js';
import { applyClaudeCodeAfterSessionEstablished } from './after-session.js';
import { claudeCodeAuthErrorHints } from './auth.js';
import {
  buildClaudeCodeAcpSpawnCommand,
  createClaudeCodeAcpClient,
  detectLocalAgentPresence,
} from './client.js';
import {
  claudeCodeInstallDetectCommand,
  claudeCodeInstallTokenEnvVar,
  installClaudeCode,
} from './install.js';

export const claudeCodeHarnessOptions: HarnessOptions = {
  type: 'claude-code',
  displayName: 'Claude Code',
  defaultCommand: ['npx', '--yes', '@agentclientprotocol/claude-agent-acp'],
  authErrorHints: claudeCodeAuthErrorHints,
  installDetectCommand: claudeCodeInstallDetectCommand,
  installTokenEnvVar: claudeCodeInstallTokenEnvVar,
};

export const claudeCodeHarnessImplementation: HarnessImplementation = {
  detectPresence: detectLocalAgentPresence,
  install: installClaudeCode,
  createClient: (options) =>
    createClaudeCodeAcpClient({
      ...options,
      afterSessionEstablished: options.afterSessionEstablished ?? applyClaudeCodeAfterSessionEstablished,
    }),
  buildSpawnCommand: (base, sessionMode) => buildClaudeCodeAcpSpawnCommand([...base], sessionMode),
};

export const claudeCodeHarness = { ...claudeCodeHarnessOptions, ...claudeCodeHarnessImplementation };
