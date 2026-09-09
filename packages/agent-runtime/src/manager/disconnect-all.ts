import { invalidateAcpClientState } from '../client-lifecycle/acp-client-state.js';
import type { AgentRuntimeContext } from './runtime-context.js';

export async function disconnectAll(ctx: AgentRuntimeContext): Promise<void> {
  await Promise.all(
    [...ctx.acpAgents.values()].map(async (state) => {
      try {
        await state.acpHandle?.disconnectGracefully();
      } catch {
        /* ignore */
      }
      invalidateAcpClientState(state);
    }),
  );
  ctx.acpAgents.clear();
  ctx.runDispatch.clear();
  ctx.pendingCancelRunIds.clear();
}
