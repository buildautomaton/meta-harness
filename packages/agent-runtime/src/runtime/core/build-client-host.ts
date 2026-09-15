import type { ClientHostHooks } from '@runtime/acp/engine/types.js';
import type { HarnessHooks } from '@/types/harness/hooks.js';
import type { HarnessHostImplementation } from '@/types/harness/host.js';
import type { SessionBackend } from '@runtime/session/types.js';
import { mergeHarnessHost, mergeHarnessHooks } from './merge-hooks.js';
import { persistHooksFromBackend } from '@runtime/session/persist-hooks.js';

/** Session persist plus harness hooks/host — the engine's client-side host. */
export async function buildClientHostHooks(options: {
  backend: SessionBackend;
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
}): Promise<ClientHostHooks> {
  const persist = await persistHooksFromBackend(options.backend);
  const host = mergeHarnessHost(persist, options.harnessHost);
  const hooks = mergeHarnessHooks({}, options.harnessHooks);
  return { ...host, ...hooks };
}
