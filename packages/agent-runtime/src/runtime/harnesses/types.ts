import type { HarnessOptions } from '../../types/harness/options.js';
import type { HarnessImplementation } from '../../types/harness/implementation.js';

export type AgentHarness = HarnessOptions & HarnessImplementation;

export type AgentHarnessRegistry = {
  register(harness: AgentHarness): void;
  get(agentType: string | null | undefined): AgentHarness | undefined;
  list(): readonly AgentHarness[];
  listAutoDetect(): AgentHarness[];
};
