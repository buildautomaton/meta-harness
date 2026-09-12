/**
 * Shared `session/update` handling: config/commands persist side-channels and load-replay suppression.
 */

import { availableCommandsFromSessionUpdatePayload } from './parse-available-commands.js';

export type SessionUpdateDispatchOpts = {
  /** Flat or inner update object with `sessionUpdate` / `session_update` at top level. */
  flatPayload: Record<string, unknown>;
  onAcpConfigOptionsUpdated?: (configOptions: unknown[]) => void;
  onAcpAvailableCommandsUpdated?: (availableCommands: unknown[]) => void;
  onSessionUpdate?: (payload: unknown) => void;
  suppressLoadReplay: () => boolean;
};

/** Forwards to `onSessionUpdate` unless this is a persist-only update or load replay suppression applies. */
export function dispatchAcpSessionUpdate(opts: SessionUpdateDispatchOpts): void {
  const {
    flatPayload,
    onAcpConfigOptionsUpdated,
    onAcpAvailableCommandsUpdated,
    onSessionUpdate,
    suppressLoadReplay,
  } = opts;
  const su = flatPayload.sessionUpdate ?? flatPayload.session_update;
  if (su === 'config_option_update') {
    const co = flatPayload.configOptions;
    if (Array.isArray(co)) onAcpConfigOptionsUpdated?.(co);
    return;
  }
  if (su === 'available_commands_update') {
    const cmds = availableCommandsFromSessionUpdatePayload(flatPayload);
    if (cmds) onAcpAvailableCommandsUpdated?.(cmds);
    return;
  }
  if (suppressLoadReplay()) return;
  onSessionUpdate?.(flatPayload);
}
