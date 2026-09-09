import type { DiscoveredAgent } from '../types/discovery.js';
import { yieldToEventLoop } from '../util/yield-to-event-loop.js';
import { isShutdownRequested } from '../util/shutdown.js';
import { listAutoDetectAgentProviders } from '../providers/registry.js';

/** Discover local agents via provider detectPresence hooks (best-effort). */
export async function discoverAgents(): Promise<DiscoveredAgent[]> {
  try {
    if (isShutdownRequested()) return [];
    const providers = listAutoDetectAgentProviders();
    const out: DiscoveredAgent[] = [];
    for (let i = 0; i < providers.length; i++) {
      if (isShutdownRequested()) return out;
      if (i > 0) {
        await yieldToEventLoop();
        if (isShutdownRequested()) return out;
      }
      const provider = providers[i]!;
      try {
        if (await provider.detectPresence?.()) {
          out.push({ type: provider.type, displayName: provider.displayName });
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
export async function detectLocalAgentTypes(): Promise<string[]> {
  return (await discoverAgents()).map((a) => a.type);
}
