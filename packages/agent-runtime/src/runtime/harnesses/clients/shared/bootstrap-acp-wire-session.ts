/**
 * Full wire handshake after subprocess spawn: `initialize` → optional `afterInitialize` →
 * resume/load/new → persist hooks → harness `afterSessionEstablished` → shared model apply.
 */

import type { AgentConfig } from '../../../core/util/agent-config.js';
import { applyAcpModelFromAcpSession } from '../../model/apply-acp-model-from-agent-session.js';
import type { SessionConfigOption, SessionModeState } from '@agentclientprotocol/sdk';
import type { AcpSessionTransport } from '../acp-session-transport.js';
import type { AcpSessionContext } from '../acp-session-context.js';
import { configOptionsForPermission } from './config-options-for-permission.js';
import { establishAcpSessionWithTransport, type AcpEstablishedWire } from './establish-acp-session.js';
import { parseAcpInitAgentCapabilities } from './parse-acp-init-capabilities.js';

function configOptionsWithModes(configOptions: unknown[] | null, modes: unknown): unknown[] | null {
  const modeState = modes && typeof modes === 'object' ? (modes as SessionModeState) : null;
  if (!modeState?.availableModes?.length) return configOptions;
  const hasModeConfig = Array.isArray(configOptions) && configOptions.some((raw) => {
    if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return false;
    const o = raw as Record<string, unknown>;
    return o.category === 'mode' || o.id === 'mode';
  });
  if (hasModeConfig) return configOptions;
  return [
    ...(configOptions ?? []),
    {
      id: 'mode',
      name: 'Mode',
      type: 'select',
      category: 'mode',
      currentValue: modeState.currentModeId ?? null,
      options: modeState.availableModes.map((m) => {
        const r = m as typeof m & { description?: unknown };
        return {
          value: m.id,
          name: m.name ?? m.id,
          ...(typeof r.description === 'string' && r.description.trim() !== ''
            ? { description: r.description.trim() }
            : {}),
        };
      }),
    },
  ];
}

export async function bootstrapAcpWireSession(
  transport: AcpSessionTransport,
  ctx: AcpSessionContext,
  initializeRequest: Record<string, unknown>,
): Promise<AcpEstablishedWire> {
  const initResult = await transport.initialize(initializeRequest);
  const { canResume, canLoad, promptSupportsImage } = parseAcpInitAgentCapabilities(initResult);
  ctx.agentPromptImageSupported = promptSupportsImage;
  await transport.afterInitialize?.();

  const established = await establishAcpSessionWithTransport(transport, ctx, canResume, canLoad);
  established.configOptions = configOptionsWithModes(established.configOptions, established.modes);
  const sessionId = established.sessionId;
  ctx.onAcpSessionEstablished?.({
    acpSessionId: sessionId,
    configOptions: established.configOptions,
    modes: established.modes,
  });

  await ctx.afterSessionEstablished?.({
    sessionId,
    transport,
    ctx,
    configOptions: established.configOptions,
    modes: established.modes,
  });

  const cfgAll: AgentConfig | null =
    ctx.agentConfig != null && typeof ctx.agentConfig === 'object' && !Array.isArray(ctx.agentConfig)
      ? (ctx.agentConfig as AgentConfig)
      : null;
  const configOptionsForModel = established.configOptions as SessionConfigOption[] | null | undefined;
  if (transport.setSessionConfigOption) {
    await applyAcpModelFromAcpSession({
      sessionId,
      agentConfig: cfgAll,
      configOptions: configOptionsForPermission(ctx.getActiveConfigOptions, configOptionsForModel),
      setSessionConfigOption: (p) => transport.setSessionConfigOption!(p),
      logDebug: ctx.logDebug,
    });
  }

  return established;
}
