import { invalidateAcpClientState } from '@runtime/acp/lifecycle/acp-client-state.js';
import type { AcpEngineContext } from './engine-context.js';

export async function disconnectAll(ctx: AcpEngineContext): Promise<void> {
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
