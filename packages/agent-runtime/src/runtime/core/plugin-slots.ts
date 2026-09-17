import type { AgentHarness } from '@runtime/harnesses/types.js';
import type { HarnessHostImplementation } from '@/types/harness/host.js';
import type { HarnessHooks } from '@/types/harness/hooks.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { SessionBackend, SessionBackendWrap } from '@runtime/session/types.js';
import type { ToolsImplementation } from '@/types/tools/implementation.js';
import type { ToolsHooks } from '@/types/tools/hooks.js';
import type { HostTransport } from '@runtime/transport/types.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { WorkBackend, WorkBackendWrap } from '@/types/work/implementation.js';
import type { WorkHooks } from '@/types/work/hooks.js';

export type PluginSlots = {
  harnesses: AgentHarness[];
  tools: ToolsImplementation[];
  backend?: SessionBackend;
  backendWraps: SessionBackendWrap[];
  transport?: HostTransport;
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
  sessionHooks?: SessionHooks;
  transportHooks?: TransportHooks;
  toolsHooks?: ToolsHooks;
  work?: WorkBackend;
  works: Record<string, WorkBackend>;
  workName?: string;
  workWraps: WorkBackendWrap[];
  workHooks?: WorkHooks;
};

export function createPluginSlots(): PluginSlots {
  return { harnesses: [], tools: [], backendWraps: [], workWraps: [], works: {} };
}
