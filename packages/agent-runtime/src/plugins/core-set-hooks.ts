import type { HarnessHooks } from '@/types/harness/hooks.js';
import type { SessionHooks } from '@/types/session/hooks.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { ToolsHooks } from '@/types/tools/hooks.js';
import type { WorkHooks } from '@/types/work/hooks.js';

export type CoreSetHooks = {
  harness?: HarnessHooks;
  session?: SessionHooks;
  transport?: TransportHooks;
  tools?: ToolsHooks;
  work?: WorkHooks;
};
