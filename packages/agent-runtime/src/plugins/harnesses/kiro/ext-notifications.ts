/**
 * Kiro CLI (`kiro-cli acp`) emits vendor JSON-RPC notifications under `_kiro.dev/*`.
 * `@agentclientprotocol/sdk` treats unknown notifications as errors and logs to stderr unless the
 * client implements `extNotification`.
 *
 * We ignore `_kiro.dev/session/update` and `_kiro.dev/commands/available` — they overlap normal
 * `session/update` traffic and command lists we already handle or do not need.
 *
 * `_kiro.dev/metadata` carries `contextUsagePercentage`; we forward that as a synthetic session
 * update so the transcript can show a small context-usage chip (see `context_usage` in UI).
 */

export function createKiroSdkExtNotificationHandler(options: {
  onSessionUpdate?: (payload: unknown) => void;
}): (method: string, params: unknown) => Promise<void> {
  const { onSessionUpdate } = options;
  return async (method, params) => {
    if (method === '_kiro.dev/metadata') {
      const p = params && typeof params === 'object' ? (params as Record<string, unknown>) : {};
      const pct = p.contextUsagePercentage;
      if (typeof pct !== 'number' || !Number.isFinite(pct) || !onSessionUpdate) return;
      onSessionUpdate({
        sessionUpdate: 'context_usage',
        contextUsagePercentage: pct,
      });
      return;
    }
    // _kiro.dev/session/update, _kiro.dev/commands/available, future vendor hooks — silent no-op.
  };
}
