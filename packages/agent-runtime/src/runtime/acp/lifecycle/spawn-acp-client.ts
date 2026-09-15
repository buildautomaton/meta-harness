import type { AcpClientHandle } from '@runtime/acp/client-types.js';
import { errorMessage } from '@runtime/core/util/error-message.js';
import { isShutdownRequested } from '@runtime/core/util/shutdown.js';
import { spawnCreateClientOptions, type SpawnAcpClientParams } from './spawn-acp-client-args.js';

export type { SpawnAcpClientParams };

export function spawnAcpClient(params: SpawnAcpClientParams): Promise<AcpClientHandle | null> {
  const { state, resolved, preferredAgentType, acpAgentKey, scopeId, log, hostHooks } = params;
  const persisted =
    scopeId && preferredAgentType ? hostHooks?.readPersistedSession?.(scopeId) ?? null : null;
  const persistedAcpSessionId = persisted?.acpSessionId?.trim() || null;
  state.activeSessionConfigOptions = Array.isArray(persisted?.configOptions)
    ? persisted!.configOptions
    : null;
  const spawnEpoch = state.clientEpoch;
  return resolved
    .createClient(spawnCreateClientOptions(params, state, persistedAcpSessionId))
    .then(async (h) => {
      if (spawnEpoch !== state.clientEpoch || isShutdownRequested()) {
        try {
          await h.disconnectGracefully();
        } catch {
          /* ignore */
        }
        state.acpStartPromise = null;
        return null;
      }
      state.lastAcpStartError = null;
      state.acpHandle = h;
      state.lastAcpCwd = params.targetCwd;
      state.acpAgentKey = acpAgentKey;
      return h;
    })
    .catch((err) => {
      state.lastAcpStartError = errorMessage(err);
      log(`[Agent] Failed to start: ${state.lastAcpStartError}`);
      state.acpStartPromise = null;
      state.acpAgentKey = null;
      return null;
    });
}
