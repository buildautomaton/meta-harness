import type { AcpSessionAgentKey } from '@runtime/acp/keys/acp-agent.js';
import { createEmptyAcpClientState } from '@runtime/acp/lifecycle/acp-client-state.js';
import type { AcpEngineContext } from './engine-context.js';

export function getAcpSessionAgentState(ctx: AcpEngineContext, acpSessionAgentKey: AcpSessionAgentKey) {
  let state = ctx.acpAgents.get(acpSessionAgentKey);
  if (!state) {
    state = createEmptyAcpClientState();
    ctx.acpAgents.set(acpSessionAgentKey, state);
  }
  return state;
}
