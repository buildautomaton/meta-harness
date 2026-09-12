import { createAgentRuntimeManager } from './manager/create-agent-runtime-manager.js';
import type { AgentRuntimeManager, ClientHostHooks } from './manager/types.js';
import type { HarnessHooks } from '../../types/harness/hooks.js';
import type { HarnessHostImplementation } from '../../types/harness/host.js';
import type { SessionBackend } from '../session/types.js';
import type { LogFn } from '../../types/log.js';
import { mergeHarnessHost, mergeHarnessHooks } from './merge-hooks.js';
import { persistHooksFromBackend } from '../session/persist-hooks.js';
import { RUNTIME_VERSION } from './version.js';

export async function createRuntimeManager(options: {
  log: LogFn;
  backend: SessionBackend;
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
  isShutdownRequested?: () => boolean;
}): Promise<AgentRuntimeManager> {
  const persist = await persistHooksFromBackend(options.backend);
  const host = mergeHarnessHost(persist, options.harnessHost);
  const hooks = mergeHarnessHooks({}, options.harnessHooks);
  const clientHostHooks: ClientHostHooks = { ...host, ...hooks };
  return createAgentRuntimeManager({
    log: options.log,
    isShutdownRequested: options.isShutdownRequested,
    clientHostHooks,
    clientInfo: { name: 'meta-harness', version: RUNTIME_VERSION },
  });
}
