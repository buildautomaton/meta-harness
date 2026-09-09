import type { AgentConfig } from '../../util/agent-config.js';
import type { SessionConfigOption, SessionModeState } from '@agentclientprotocol/sdk';
import type { AfterAcpSessionEstablished } from '../../types/session-context.js';
import { configOptionsForPermission } from '../../clients/shared/config-options-for-permission.js';

type ApplyPermissionFn = (params: {
  sessionId: string;
  agentConfig: AgentConfig | null;
  configOptions: SessionConfigOption[] | null | undefined;
  modes: SessionModeState | null | undefined;
  setSessionConfigOption: (p: { sessionId: string; configId: string; value: string }) => Promise<unknown>;
  setSessionMode: (p: { sessionId: string; modeId: string }) => Promise<unknown>;
  logDebug: (line: string) => void;
}) => Promise<void>;

/** Bind a harness permission-mode apply fn to the shared ACP after-session hook. */
export function wrapPermissionAfterSession(apply: ApplyPermissionFn): AfterAcpSessionEstablished {
  return async ({ sessionId, transport, ctx, configOptions, modes }) => {
    const raw = ctx.agentConfig;
    const agentConfig: AgentConfig | null =
      raw != null && typeof raw === 'object' && !Array.isArray(raw) ? (raw as AgentConfig) : null;
    await apply({
      sessionId,
      agentConfig,
      configOptions: configOptionsForPermission(
        ctx.getActiveConfigOptions,
        configOptions as SessionConfigOption[] | null | undefined,
      ),
      modes: modes as SessionModeState | null | undefined,
      setSessionConfigOption: transport.setSessionConfigOption
        ? (p) => transport.setSessionConfigOption!(p)
        : async () => {},
      setSessionMode: transport.setSessionMode ? (p) => transport.setSessionMode!(p) : async () => {},
      logDebug: ctx.logDebug,
    });
  };
}
