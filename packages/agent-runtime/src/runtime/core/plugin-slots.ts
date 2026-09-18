import type { AgentHarness } from '@runtime/harnesses/types.js';
import type { HarnessHostImplementation } from '@/types/harness/host.js';
import type { HarnessHooks } from '@/types/harness/hooks.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { SessionBackend, SessionBackendWrap } from '@runtime/session/types.js';
import type { SessionPlugin } from '@/types/session/plugin.js';
import type { ToolsImplementation } from '@/types/tools/implementation.js';
import type { ToolsHooks } from '@/types/tools/hooks.js';
import type { HostTransport } from '@runtime/transport/types.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { TransportEndpoint } from '@/types/transport/endpoints.js';
import type { FileStore } from '@/types/file-store/implementation.js';
import type { SqlStore } from '@/types/sql-store/implementation.js';
import type { HttpRegistry } from '@/types/http/registry.js';
import type { AgentRuntimePlugin } from '@/types/plugin.js';

export type PluginSlots = {
  plugins: AgentRuntimePlugin[];
  byKind: Map<string, AgentRuntimePlugin[]>;
  extras: Record<string, unknown>;
  harnesses: AgentHarness[];
  tools: ToolsImplementation[];
  backend?: SessionBackend;
  backendWraps: SessionBackendWrap[];
  sessionPlugins: SessionPlugin[];
  transport?: HostTransport;
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
  sessionHooks?: SessionHooks;
  transportHooks?: TransportHooks;
  toolsHooks?: ToolsHooks;
  fileStore?: FileStore;
  sqlStore?: SqlStore;
  http?: HttpRegistry;
  httpEndpoints: TransportEndpoint[];
};

export function createPluginSlots(): PluginSlots {
  return {
    plugins: [],
    byKind: new Map(),
    extras: {},
    harnesses: [],
    tools: [],
    backendWraps: [],
    sessionPlugins: [],
    httpEndpoints: [],
  };
}
