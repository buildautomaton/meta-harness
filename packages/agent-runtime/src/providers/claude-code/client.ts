/**
 * Claude Code over ACP (`@agentclientprotocol/claude-agent-acp` + `@agentclientprotocol/sdk`).
 * Permission behavior is driven by ACP session modes (`session/set_mode`), not `claude` CLI argv.
 *
 * @see https://agentclientprotocol.com/protocol/session-modes
 */

import type { AcpClientHandle, AcpClientOptions } from '../../clients/acp-client.js';
import { execProbeShutdownAware } from '../../clients/detect-command-on-path.js';
import { createSdkStdioAcpClient } from '../../clients/sdk/sdk-stdio-acp-client.js';

/** Backend `type` for bridge local agents (align with UI and `resolve-agent-command`). */
export const BACKEND_LOCAL_AGENT_TYPE = 'claude-code' as const;

/** Same ACP adapter argv as {@link resolveAgentCommand} / capability probes (not the interactive `claude` CLI). */
const CLAUDE_ACP_ADAPTER_NPX_ARGS = ['--yes', '@agentclientprotocol/claude-agent-acp'] as const;

/**
 * Bridge spawns `@agentclientprotocol/claude-agent-acp` via npx. The interactive `claude` binary or
 * `@anthropic-ai/claude-code --version` can succeed without a working platform native ACP binary (e.g. linux-x64).
 */
export async function detectLocalAgentPresence(): Promise<boolean> {
  return execProbeShutdownAware('npx', [...CLAUDE_ACP_ADAPTER_NPX_ARGS, '--help'], 8_000);
}

/** Spawn argv for the Claude ACP adapter subprocess (permission mode is ACP `session/set_mode`, not CLI flags). */
export function buildClaudeCodeAcpSpawnCommand(base: string[], _sessionMode?: string): string[] {
  return [...base];
}

export async function createClaudeCodeAcpClient(options: AcpClientOptions): Promise<AcpClientHandle> {
  const command = buildClaudeCodeAcpSpawnCommand(options.command, options.sessionMode);
  return createSdkStdioAcpClient({
    ...options,
    command,
    /** Claude-based agents sometimes ignore `session/cancel`; unblocks stop / stuck prompt. */
    /** Claude Code can be slow to honor ACP `session/cancel`; give the subprocess a moment before SIGKILL (see ACP prompt-turn cancellation). */
    killSubprocessAfterCancelMs: options.killSubprocessAfterCancelMs ?? 2500,
  });
}
