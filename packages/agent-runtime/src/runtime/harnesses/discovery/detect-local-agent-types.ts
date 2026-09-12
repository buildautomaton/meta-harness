import type { DiscoveredAgent } from '../discovery-types.js';
import type { AgentHarness } from '../types.js';
import { yieldToEventLoop } from '../../core/util/yield-to-event-loop.js';
import { isShutdownRequested } from '../../core/util/shutdown.js';

/** Discover local agents via harness detectPresence hooks (best-effort). */
export async function discoverAgents(
  harnesses: readonly AgentHarness[],
): Promise<DiscoveredAgent[]> {
  try {
    if (isShutdownRequested()) return [];
    const out: DiscoveredAgent[] = [];
    for (let i = 0; i < harnesses.length; i++) {
      if (isShutdownRequested()) return out;
      if (i > 0) {
        await yieldToEventLoop();
        if (isShutdownRequested()) return out;
      }
      const harness = harnesses[i]!;
      try {
        if (await harness.detectPresence?.()) {
          out.push({ type: harness.type, displayName: harness.displayName });
        }
      } catch {
        /* skip */
      }
    }
    return out;
  } catch {
    return [];
  }
}

/** Backend local-agent type strings only (legacy bridge helper). */
export async function detectLocalAgentTypes(
  harnesses: readonly AgentHarness[],
): Promise<string[]> {
  return (await discoverAgents(harnesses)).map((a) => a.type);
}
