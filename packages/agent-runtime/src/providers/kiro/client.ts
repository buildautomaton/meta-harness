/**
 * ACP client for [Kiro CLI](https://kiro.dev/docs/cli/acp/) — JSON-RPC ACP over stdio (`kiro-cli acp`).
 */

import type { AcpClientHandle, AcpClientOptions } from '../../clients/acp-client.js';
import { isCommandOnPath } from '../../clients/detect-command-on-path.js';
import { createSdkStdioAcpClient } from '../../clients/sdk/sdk-stdio-acp-client.js';

/** Backend `type` for bridge local agents (align with UI and `resolve-agent-command`). */
export const BACKEND_LOCAL_AGENT_TYPE = 'kiro-acp' as const;

export async function detectLocalAgentPresence(): Promise<boolean> {
  return isCommandOnPath('kiro-cli');
}

/** Default spawn when workspace agent type is kiro-acp. */
export const DEFAULT_KIRO_ACP_COMMAND = ['kiro-cli', 'acp'] as const;

export function isKiroAcpCommand(command: string[]): boolean {
  if (command.length < 2) return false;
  if (command[command.length - 1] !== 'acp') return false;
  return command.slice(0, -1).some(
    (a) => a === 'kiro-cli' || /[/\\]kiro-cli(\.exe)?$/i.test(a),
  );
}

/** Kiro ACP does not map bridge session mode to CLI flags today. */
export function buildKiroAcpSpawnCommand(base: string[], _sessionMode?: string): string[] {
  return [...base];
}

export async function createKiroAcpClient(options: AcpClientOptions): Promise<AcpClientHandle> {
  const base =
    options.command?.length && isKiroAcpCommand(options.command)
      ? options.command
      : [...DEFAULT_KIRO_ACP_COMMAND];
  const command = buildKiroAcpSpawnCommand(base, options.sessionMode);
  return createSdkStdioAcpClient({ ...options, command });
}
