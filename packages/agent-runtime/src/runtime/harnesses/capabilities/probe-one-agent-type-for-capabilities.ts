import * as path from 'node:path';
import type { AgentCapabilities } from '../capability-types.js';
import type { LogFn } from '../../../types/log.js';
import {
  resolveAgentCommand,
  type GetAgentHarnessFn,
} from '../keys/resolve-agent-command.js';
import { delayMsUnlessShutdownRequested, isShutdownRequested } from '../../core/util/shutdown.js';
import { yieldToEventLoop } from '../../core/util/yield-to-event-loop.js';
import type { AcpClientHandle } from '../client-types.js';

export const ACP_CAPABILITY_PROBE_TIMEOUT_MS = 12_000;

/** Probe one agent type via ACP handshake; returns config options when available. */
export async function probeOneAgentTypeForCapabilities(params: {
  agentType: string;
  cwd?: string;
  log: LogFn;
  signal?: AbortSignal;
  shouldContinue?: () => boolean;
  getHarness?: GetAgentHarnessFn;
}): Promise<AgentCapabilities | null> {
  const { agentType, log, signal, shouldContinue, getHarness } = params;
  const cwd = path.resolve(params.cwd?.trim() || process.cwd());
  const canContinue = () => shouldContinue?.() !== false && !isShutdownRequested();
  if (!canContinue()) return null;

  const resolved = resolveAgentCommand(agentType, getHarness);
  if (!resolved) return null;

  await yieldToEventLoop();
  if (!canContinue()) return null;

  let pendingCo: unknown[] | null = null;
  let pendingCmds: unknown[] | null = null;
  const ac = new AbortController();
  const onAbort = () => ac.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  const abortTimer = setTimeout(() => ac.abort(), ACP_CAPABILITY_PROBE_TIMEOUT_MS);
  abortTimer.unref?.();
  const abortIfStale = setInterval(() => {
    if (!canContinue()) ac.abort();
  }, 50);
  abortIfStale.unref?.();

  let handle: AcpClientHandle | null = null;
  try {
    handle = await resolved.createClient({
      command: resolved.command,
      cwd,
      backendAgentType: agentType,
      sessionMode: 'agent',
      persistedAcpSessionId: null,
      agentConfig: null,
      signal: ac.signal,
      getActiveConfigOptions: () => null,
      onAcpSessionEstablished: (info: {
        acpSessionId: string;
        configOptions: unknown[] | null;
        modes: unknown;
      }) => {
        if (Array.isArray(info.configOptions) && info.configOptions.length > 0) {
          pendingCo = info.configOptions;
        }
      },
      onAcpConfigOptionsUpdated: (co: unknown[]) => {
        if (Array.isArray(co) && co.length > 0) pendingCo = co;
      },
      onAcpAvailableCommandsUpdated: (cmds: unknown[]) => {
        if (Array.isArray(cmds)) pendingCmds = cmds;
      },
      onAgentSubprocessExit: () => {},
      onSessionUpdate: () => {},
    });
    if (!(await delayMsUnlessShutdownRequested(1_200)) || !canContinue()) return null;
  } catch (e) {
    log(`[Agent] Capability probe (${agentType}): ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    signal?.removeEventListener('abort', onAbort);
    clearTimeout(abortTimer);
    clearInterval(abortIfStale);
    try {
      await handle?.disconnectGracefully();
    } catch {
      /* ignore */
    }
  }

  if (!pendingCo || !canContinue()) return null;
  return {
    agentType,
    configOptions: pendingCo,
    availableCommands: pendingCmds,
  };
}
