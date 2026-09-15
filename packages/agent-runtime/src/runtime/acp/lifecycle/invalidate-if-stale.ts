import * as path from 'node:path';
import type { AcpClientState } from './acp-client-state.js';
import { invalidateAcpClientState } from './acp-client-state.js';

/** Drop a live handle when cwd or spawn identity no longer matches this prompt. */
export function invalidateIfStale(
  state: AcpClientState,
  targetCwd: string,
  acpAgentKey: string,
): void {
  if (state.acpHandle && state.lastAcpCwd != null && path.resolve(state.lastAcpCwd) !== targetCwd) {
    try {
      state.acpHandle.disconnect();
    } catch {
      /* ignore */
    }
    invalidateAcpClientState(state);
  }
  if (state.acpHandle && state.acpAgentKey !== acpAgentKey) {
    try {
      state.acpHandle.disconnect();
    } catch {
      /* ignore */
    }
    invalidateAcpClientState(state);
  }
}
