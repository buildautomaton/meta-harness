import { createHarnessRegistry } from './create-registry.js';
import type { AgentHarness } from './types.js';

/**
 * Process-wide fallback registry (empty until something registers).
 * Prefer the per-manager registry from {@link createAgentRuntimeManager}.
 */
const globalRegistry = createHarnessRegistry();

export function listAgentHarnesses(): readonly AgentHarness[] {
  return globalRegistry.list();
}

export function registerAgentHarness(harness: AgentHarness): void {
  globalRegistry.register(harness);
}

export function getAgentHarness(agentType: string | null | undefined): AgentHarness | undefined {
  return globalRegistry.get(agentType);
}

export function listAutoDetectAgentHarnesses(): AgentHarness[] {
  return globalRegistry.listAutoDetect();
}

export function notifyAgentHarnessesSessionClosed(sessionId: string): void {
  globalRegistry.notifySessionClosed(sessionId);
}

export function notifyAgentHarnessesPromptTurnFinished(sessionId: string | undefined): void {
  globalRegistry.notifyPromptTurnFinished(sessionId);
}

/** @deprecated Prefer listAgentHarnesses() on a manager. */
export const AGENT_HARNESSES: readonly AgentHarness[] = [];
