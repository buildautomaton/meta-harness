import type { AgentHarness, AgentHarnessRegistry } from './types.js';

export type RuntimeHarnessRegistry = AgentHarnessRegistry & {
  notifySessionClosed(sessionId: string): void;
  notifyPromptTurnFinished(sessionId: string | undefined): void;
};

/** Isolated harness registry (one per runtime manager). */
export function createHarnessRegistry(
  initial: readonly AgentHarness[] = [],
): RuntimeHarnessRegistry {
  const harnesses: AgentHarness[] = [...initial];
  const byType = new Map(harnesses.map((p) => [p.type, p]));

  function register(harness: AgentHarness): void {
    const idx = harnesses.findIndex((p) => p.type === harness.type);
    if (idx >= 0) harnesses[idx] = harness;
    else harnesses.push(harness);
    byType.set(harness.type, harness);
  }

  return {
    register,
    get(agentType) {
      if (agentType == null || agentType === '') return undefined;
      return byType.get(agentType);
    },
    list: () => harnesses,
    listAutoDetect: () => harnesses.filter((p) => p.detectPresence != null),
    notifySessionClosed(sessionId) {
      for (const p of harnesses) p.onSessionClosed?.(sessionId);
    },
    notifyPromptTurnFinished(sessionId) {
      for (const p of harnesses) p.onPromptTurnFinished?.(sessionId);
    },
  };
}
