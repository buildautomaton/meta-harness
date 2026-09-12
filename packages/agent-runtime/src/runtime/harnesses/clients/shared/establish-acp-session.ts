/**
 * Shared ACP session bootstrap: prefer session/resume, then session/load, then session/new.
 * Uses {@link AcpSessionTransport} so SDK and Cursor share the same control flow.
 */

import { logDebug } from '../../../core/util/log.js';
import type { AcpSessionTransport } from '../acp-session-transport.js';
import type { AcpSessionContext } from '../acp-session-context.js';

export type AcpEstablishedWire = {
  sessionId: string;
  configOptions: unknown[] | null;
  modes: unknown;
};

function establishedFromResult(raw: unknown, sessionId: string): AcpEstablishedWire {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    sessionId,
    configOptions: Array.isArray(r.configOptions) ? (r.configOptions as unknown[]) : null,
    modes: r.modes ?? null,
  };
}

function sessionIdFromNewSessionResult(raw: unknown): string {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return typeof r.sessionId === 'string' ? r.sessionId : '';
}

export async function establishAcpSessionWithTransport(
  transport: AcpSessionTransport,
  ctx: AcpSessionContext,
  canResume: boolean,
  canLoad: boolean,
): Promise<AcpEstablishedWire> {
  const { cwd, mcpServers, persistedAcpSessionId, agentLabel, suppressLoadReplay } = ctx;
  const prev =
    typeof persistedAcpSessionId === 'string' && persistedAcpSessionId.trim() !== ''
      ? persistedAcpSessionId.trim()
      : '';
  if (prev) {
    if (canResume) {
      try {
        logDebug(`[Agent] ${agentLabel} ACP session/resume for stored session ${prev.slice(0, 8)}…`);
        const result = await transport.resumeSession({ sessionId: prev, cwd, mcpServers });
        return establishedFromResult(result, prev);
      } catch (e) {
        logDebug(`[Agent] ${agentLabel} ACP session/resume failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (canLoad) {
      suppressLoadReplay.value = true;
      try {
        logDebug(`[Agent] ${agentLabel} ACP session/load for stored session ${prev.slice(0, 8)}…`);
        const result = await transport.loadSession({ sessionId: prev, cwd, mcpServers });
        return establishedFromResult(result, prev);
      } catch (e) {
        logDebug(`[Agent] ${agentLabel} ACP session/load failed: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        suppressLoadReplay.value = false;
      }
    }
  }
  const result = await transport.newSession({ cwd, mcpServers });
  const sid = sessionIdFromNewSessionResult(result);
  if (!sid) throw new Error(`${agentLabel} ACP session/new did not return sessionId`);
  return establishedFromResult(result, sid);
}
