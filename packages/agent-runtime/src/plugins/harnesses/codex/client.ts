/**
 * ACP client for Codex via the maintained `@agentclientprotocol/codex-acp` adapter.
 * @see https://github.com/agentclientprotocol/codex-acp
 */

import type { AcpClientHandle, AcpClientOptions } from '../../../runtime/harnesses/clients/acp-client.js';
import { isCommandOnPath } from '../../../runtime/harnesses/clients/detect-command-on-path.js';
import { createSdkStdioAcpClient } from '../../../runtime/harnesses/clients/sdk/sdk-stdio-acp-client.js';

/** Backend `type` for bridge local agents (align with UI and `resolve-agent-command`). */
export const BACKEND_LOCAL_AGENT_TYPE = 'codex-acp' as const;

export const CODEX_ACP_PACKAGE = '@agentclientprotocol/codex-acp';
/** Deprecated Zed package; still recognized so we can rewrite spawn argv. */
export const LEGACY_CODEX_ACP_PACKAGE = '@zed-industries/codex-acp';

export async function detectLocalAgentPresence(): Promise<boolean> {
  return isCommandOnPath('codex');
}

/** Default spawn command when workspace agent type is codex-acp. */
export const DEFAULT_CODEX_ACP_COMMAND = ['npx', '--yes', CODEX_ACP_PACKAGE] as const;

export function isCodexAcpCommand(command: string[]): boolean {
  return command.some(
    (a) => a === CODEX_ACP_PACKAGE || a === LEGACY_CODEX_ACP_PACKAGE || a.includes('codex-acp'),
  );
}

/** Rewrite deprecated Zed package name to the maintained ACP package. */
export function normalizeCodexAcpCommand(command: string[]): string[] {
  return command.map((a) => (a === LEGACY_CODEX_ACP_PACKAGE ? CODEX_ACP_PACKAGE : a));
}

/** Codex ACP mode selection is applied after session/new via ACP, not CLI argv. */
export function buildCodexAcpSpawnCommand(
  base: string[],
  _sessionMode?: string,
  _agentConfig?: Record<string, unknown> | null,
): string[] {
  return normalizeCodexAcpCommand(base);
}

/**
 * Spawns the Codex ACP adapter; same wire protocol as other @agentclientprotocol/sdk agents.
 */
export async function createCodexAcpClient(options: AcpClientOptions): Promise<AcpClientHandle> {
  const base =
    options.command?.length && options.command.some((a) => a.includes('codex-acp'))
      ? options.command
      : [...DEFAULT_CODEX_ACP_COMMAND];
  const command = buildCodexAcpSpawnCommand(base, options.sessionMode, options.agentConfig);
  return createSdkStdioAcpClient({
    ...options,
    command,
    /** Codex ACP can ignore `session/cancel`; mirror Claude Code's subprocess fallback. */
    killSubprocessAfterCancelMs: options.killSubprocessAfterCancelMs ?? 2500,
  });
}
