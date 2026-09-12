import type { AcpSessionAgentKey } from '../../harnesses/keys/acp-agent.js';
import { createEmptyAcpClientState } from '../../harnesses/client-lifecycle/acp-client-state.js';
import type { AgentRuntimeContext } from './runtime-context.js';

export function getAcpSessionAgentState(ctx: AgentRuntimeContext, acpSessionAgentKey: AcpSessionAgentKey) {
  let state = ctx.acpAgents.get(acpSessionAgentKey);
  if (!state) {
    state = createEmptyAcpClientState();
    ctx.acpAgents.set(acpSessionAgentKey, state);
  }
  return state;
}
