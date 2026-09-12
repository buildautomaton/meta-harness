/**
 * Acquire a live ACP client for one scope+agent identity.
 * Reuses an existing subprocess when cwd/agent key still match; otherwise spawns.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { AcpClientHandle } from '../client-types.js';
import type { ClientHostHooks } from '../../core/manager/types.js';
import type { ReportAgentCapabilitiesFn } from '../capability-types.js';
import type { LogFn } from '../../../types/log.js';
import { computeAcpAgentKey, type AcpAgentKey } from '../keys/acp-agent.js';
import { resolveAgentCommand, type GetAgentHarnessFn } from '../keys/resolve-agent-command.js';
import {
  invalidateAcpClientState,
  type AcpClientState,
} from './acp-client-state.js';
import { spawnAcpClient } from './spawn-acp-client.js';

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
  getHarness?: GetAgentHarnessFn;
};

export async function acquireAcpClient(
  options: AcquireAcpClientOptions,
): Promise<AcpClientHandle | null> {
  const {
    state,
    acpAgentKey,
    preferredAgentType,
    mode,
    agentConfig,
    cwd,
    scopeId,
    reportAgentCapabilities,
    sendSessionUpdate,
    sendRequest,
    log,
    hostHooks,
    getHarness,
  } = options;

  const targetCwd = path.resolve(cwd?.trim() || process.cwd());
  const mcpServers =
    hostHooks?.mcpServers?.({ accessPort: hostHooks.getAccessPort?.() ?? null }) ?? [];

  state.latestAgentConfig =
    agentConfig != null && typeof agentConfig === 'object' && !Array.isArray(agentConfig)
      ? agentConfig
      : null;

  if (state.acpStartPromise && !state.acpHandle) await state.acpStartPromise;

  if (state.acpHandle && state.lastAcpCwd != null && path.resolve(state.lastAcpCwd) !== targetCwd) {
    try {
      state.acpHandle.disconnect();
    } catch {
      /* ignore */
    }
    invalidateAcpClientState(state);
  }

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

  if (state.acpHandle && state.acpAgentKey !== acpAgentKey) {
    try {
      state.acpHandle.disconnect();
    } catch {
      /* ignore */
    }
    invalidateAcpClientState(state);
  }

  if (state.acpHandle) return state.acpHandle;

  if (!state.acpStartPromise) {
    let statOk = false;
    try {
      statOk = (await fs.promises.stat(targetCwd)).isDirectory();
      if (!statOk) {
        state.lastAcpStartError = `Agent cwd is not a directory: ${targetCwd}`;
        log(`[Agent] ${state.lastAcpStartError}`);
      }
    } catch {
      state.lastAcpStartError = `Agent cwd missing or inaccessible: ${targetCwd}`;
      log(`[Agent] ${state.lastAcpStartError}`);
    }
    if (!statOk) return null;

    state.acpStartPromise = spawnAcpClient({
      state,
      resolved,
      preferredAgentType,
      mode,
      agentConfig,
      targetCwd,
      acpAgentKey,
      scopeId,
      mcpServers,
      sendSessionUpdate,
      sendRequest,
      reportAgentCapabilities,
      log,
      hostHooks,
    });
  }

  return state.acpStartPromise;
}
