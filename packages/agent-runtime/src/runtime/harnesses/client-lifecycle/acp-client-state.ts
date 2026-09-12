/** Mutable ACP client state for one session+agent subprocess. */

import type { AcpClientHandle } from '../client-types.js';

export type AcpClientState = {
  acpHandle: AcpClientHandle | null;
  acpStartPromise: Promise<AcpClientHandle | null> | null;
  lastAcpStartError: string | null;
  lastAcpCwd: string | null;
  acpAgentKey: string | null;
  activeSessionConfigOptions: unknown[] | null;
  activeAvailableCommands: unknown[] | null;
  latestAgentConfig: Record<string, unknown> | null;
  clientEpoch: number;
};

export function invalidateAcpClientState(state: AcpClientState): void {
  state.clientEpoch += 1;
  state.acpHandle = null;
  state.acpStartPromise = null;
  state.acpAgentKey = null;
  state.activeSessionConfigOptions = null;
  state.activeAvailableCommands = null;
  state.latestAgentConfig = null;
}

export function createEmptyAcpClientState(): AcpClientState {
  return {
    acpHandle: null,
    acpStartPromise: null,
    lastAcpStartError: null,
    lastAcpCwd: null,
    acpAgentKey: null,
    activeSessionConfigOptions: null,
    activeAvailableCommands: null,
    latestAgentConfig: null,
    clientEpoch: 0,
  };
}
