import type { ToolCallExtras, ToolContext } from '../../../types/tools/implementation.js';
import type { CoreToolHost, MinionContextResult } from './core-registry.js';
import { applyMinionAuthToken } from './apply-auth.js';
import { launchSession } from './launch-session.js';
import { permissionResultFromDecision } from './permission-result.js';
import type { PendingStore } from './pending-store.js';
import { getSessionStatus } from './session-status.js';
import { waitForMinion } from './wait-minion.js';

export function bindMinionHost(
  ctx: ToolContext,
  pending: PendingStore,
  extras?: ToolCallExtras,
): CoreToolHost {
  return {
    spawnMinion: async (params, opts) => {
      const { sessionId } = await launchSession({
        manager: ctx.manager,
        backend: ctx.backend,
        cwd: ctx.cwd,
        params,
        sessionHooks: ctx.sessionHooks,
        toolsHooks: ctx.toolsHooks,
        notifier: ctx.notifier,
        pending,
      });
      if (opts?.background) {
        return getSessionStatus(ctx.backend, sessionId, pending.list(sessionId), ctx.manager);
      }
      extras?.reportProgress?.({ message: 'Minion spawned; waiting for result', progress: 0 });
      return waitForMinion({
        backend: ctx.backend,
        pending,
        manager: ctx.manager,
        notifier: ctx.notifier,
        minionId: sessionId,
        extras,
      });
    },
    awaitMinion: (minionId) =>
      waitForMinion({
        backend: ctx.backend,
        pending,
        manager: ctx.manager,
        notifier: ctx.notifier,
        minionId,
        extras,
      }),
    getMinion: (minionId) =>
      getSessionStatus(ctx.backend, minionId, pending.list(minionId), ctx.manager),
    getMinionContext: () => minionContext(ctx),
    resolveMinionRequest: (args) => resolveRequest(ctx, pending, args),
  };
}

export function minionContext(ctx: ToolContext): MinionContextResult {
  return {
    workingDirectory: ctx.cwd,
    harnesses: ctx.manager.listHarnesses().map((h) => ({
      type: h.type,
      displayName: h.displayName,
      ...(h.installTokenEnvVar ? { authEnvVar: h.installTokenEnvVar } : {}),
    })),
    note: 'Minions spawn in workingDirectory and share this coordinator workspace. Prefer spawn_minion (it waits like Task) over builtin Task/subagent tools.',
  };
}

async function resolveRequest(
  ctx: ToolContext,
  pending: PendingStore,
  args: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string; storedAuth?: boolean; envVar?: string }> {
  const minionId = str(args.minionId);
  if (!minionId) return { ok: false, error: 'minionId is required' };
  const token = str(args.token);
  const snapshot = await ctx.backend.get(minionId);
  const harness = snapshot?.session.harness ?? '';
  const stored = token ? applyMinionAuthToken(ctx.manager, harness, token) : { stored: false };
  const requestId = str(args.requestId);
  if (requestId) {
    const listed = pending.list(minionId);
    const match = listed.find((item) => item.requestId === requestId);
    const result = permissionResultFromDecision(args, match ? { options: match.options } : undefined);
    if (!pending.complete(requestId, result) && !requestId.startsWith('auth:')) {
      return { ok: false, error: `Unknown request: ${requestId}` };
    }
  }
  return { ok: true, storedAuth: stored.stored, envVar: stored.envVar };
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
