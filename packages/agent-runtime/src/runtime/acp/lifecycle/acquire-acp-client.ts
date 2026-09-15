/**
 * Acquire a live ACP client for one scope+agent identity.
 * Reuses an existing subprocess when cwd/agent key still match; otherwise spawns.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AcpClientHandle } from '@runtime/acp/client-types.js';
import type { ClientHostHooks } from '@runtime/acp/engine/types.js';
import type { ReportAgentCapabilitiesFn } from '@runtime/acp/capability-types.js';
import type { LogFn } from '@/types/log.js';
import { computeAcpAgentKey, type AcpAgentKey } from '@runtime/acp/keys/acp-agent.js';
import { resolveAgentCommand, type GetAgentHarnessFn } from '@runtime/acp/keys/resolve-agent-command.js';
import type { AcpClientState } from './acp-client-state.js';
import { spawnAcpClient } from './spawn-acp-client.js';
import { invalidateIfStale } from './invalidate-if-stale.js';

export type AcquireAcpClientOptions = {
  state: AcpClientState;
  acpAgentKey: AcpAgentKey;
  preferredAgentType: string | null;
  mode?: string;
  agentConfig?: Record<string, unknown> | null;
  cwd?: string;
  scopeId?: string;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest: (payload: unknown) => void;
  log: LogFn;
  hostHooks?: ClientHostHooks;
  getHarness: GetAgentHarnessFn;
  clientInfo?: { name: string; version: string };
};

export async function acquireAcpClient(
  options: AcquireAcpClientOptions,
): Promise<AcpClientHandle | null> {
  const { state, acpAgentKey, preferredAgentType, mode, agentConfig, cwd, log, getHarness } = options;
  const targetCwd = path.resolve(cwd?.trim() || process.cwd());
  const mcpServers =
    options.hostHooks?.mcpServers?.({ accessPort: options.hostHooks.getAccessPort?.() ?? null }) ?? [];

  state.latestAgentConfig =
    agentConfig != null && typeof agentConfig === 'object' && !Array.isArray(agentConfig)
      ? agentConfig
      : null;

  if (state.acpStartPromise && !state.acpHandle) await state.acpStartPromise;
  invalidateIfStale(state, targetCwd, acpAgentKey);

  const resolved = resolveAgentCommand(preferredAgentType, getHarness);
  if (!resolved) {
    state.lastAcpStartError =
      'No agent type: send agentType on prompts or call setPreferredHarnessType.';
    log(`[Agent] ${state.lastAcpStartError}`);
    return null;
  }
  if (computeAcpAgentKey(preferredAgentType, mode, agentConfig, getHarness) !== acpAgentKey) {
    state.lastAcpStartError = 'AcpAgent key mismatch for prompt';
    log(`[Agent] ${state.lastAcpStartError}`);
    return null;
  }
  if (state.acpHandle) return state.acpHandle;
  if (state.acpStartPromise) return state.acpStartPromise;

  const cwdError = await cwdErrorMessage(targetCwd);
  if (cwdError) {
    state.lastAcpStartError = cwdError;
    log(`[Agent] ${cwdError}`);
    return null;
  }

  state.acpStartPromise = spawnAcpClient({
    ...options,
    resolved,
    targetCwd,
    mcpServers,
  });
  return state.acpStartPromise;
}

async function cwdErrorMessage(targetCwd: string): Promise<string | null> {
  try {
    if ((await fs.promises.stat(targetCwd)).isDirectory()) return null;
    return `Agent cwd is not a directory: ${targetCwd}`;
  } catch {
    return `Agent cwd missing or inaccessible: ${targetCwd}`;
  }
}
